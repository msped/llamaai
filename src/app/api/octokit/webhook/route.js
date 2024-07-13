import { App } from "@octokit/app";
import { NextResponse } from "next/server";
import createIssueComment from "@/octokit/utils/create-issue-comment";
import { getUserByProviderId } from "@/db/data/user";
import { createIssue, updateIssue, deleteIssue } from "@/octokit/data/issues";
import { isUserSubscribed } from "@/lib/isUserSubscribed";
import { requestIssueMessage } from "@/octokit/gh_utils";
import { addToIssuesQueue, removeFromIssuesQueue } from "../../queues/issues/route";
import { headers } from "next/headers";

const {
    GITHUB_APP_ID,
    GITHUB_PRIVATE_KEY,
    GITHUB_WEBHOOK_SECRET,
} = process.env;

const app = new App({
    appId: GITHUB_APP_ID,
    privateKey: GITHUB_PRIVATE_KEY,
    webhooks: { secret: GITHUB_WEBHOOK_SECRET },
});


app.webhooks.on("issues.opened", async ({ octokit, payload }) => {
    const { repository, issue, sender } = payload;
    const user = await getUserByProviderId(sender.id);
    if (
        issue.author_association === "OWNER" &&
        issue.user.login === user.username &&
        isUserSubscribed(user.id)
    ) {
        await requestIssueMessage(octokit, payload);
    } else {
        const message =
            'You do not have the correct permissions or a valid subscription/account with LlamaAI.' +
            ' Please ensure you are the repository owner and subscribe at https://llamaai.dev/';
        await createIssueComment(
            octokit,
            repository.owner.login,
            repository.name,
            issue.number,
            message
        );
    }
})

app.webhooks.on("issues.edited", async ({ payload }) => {
    const { issue } = payload;
    await updateIssue(issue.id, { title: issue.title, body: issue.body })
})

app.webhooks.on("issues.closed", async ({ payload }) => {
    const { issue } = payload;
    await updateIssue(issue.id, { open: false })
    await removeFromIssuesQueue(payload)
})

app.webhooks.on("issues.deleted", async ({ payload }) => {
    const { issue } = payload;
    await deleteIssue(issue.id)
    await removeFromIssuesQueue(payload)
})

app.webhooks.on("issue_comment.created", async ({ payload }) => {
    const { comment, repository, issue, sender } = payload;
    if (!comment.author_association === "OWNER") {
        return;
    }
    if (comment.body === "Yes") {
        const user = await getUserByProviderId(sender.id)
        await createIssue({
            id: issue.id,
            userId: user.id,
            repo: repository.name,
            nodeId: issue.node_id,
            issueNumber: issue.number,
            title: issue.title,
            body: issue.body,
            open: true,
        })
        await addToIssuesQueue(payload)
    }
    if (comment.body === "No") {
        await createIssueComment(
            octokit,
            repository.owner.login,
            repository.name,
            issue.number,
            "Ok, understood. *eats grass*"
        )
    }
})

export async function POST(req, res) {
    const requestHeaders = headers()

    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
    };
    
    try {
        const githubId = requestHeaders.get('x-github-delivery')
        const githubEvent = requestHeaders.get('x-github-event')
        const githubSignature = requestHeaders.get('x-hub-signature-256')
        let convertedBody = await req.text()
        
        await app.webhooks.verifyAndReceive({
            id: githubId,
            name: githubEvent,
            signature: githubSignature,
            payload: convertedBody
        })
        return NextResponse.json({ message: 'Event received' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: `Server Error: ${error}` }, { status: 500 });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
}; 
