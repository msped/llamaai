import { App } from "@octokit/app";
import { NextResponse } from "next/server";
import createIssueComment from "@/octokit/utils/create-issue-comment";
import { getUserByProviderId } from "@/db/data/user";
import { createIssue, updateIssue } from "@/octokit/data/issues";
import { isUserSubscribed } from "@/lib/isUserSubscribed";
import { processAssignedIssue, requestIssueMessage } from "@/octokit/gh_utils";
import { headers } from "next/headers";

const GITHUB_APP_ID = process.env.GITHUB_APP_ID;
const GITHUB_PRIVATE_KEY= process.env.GITHUB_PRIVATE_KEY
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

const app = new App({
    appId: GITHUB_APP_ID,
    privateKey: GITHUB_PRIVATE_KEY,
    webhooks: { secret: GITHUB_WEBHOOK_SECRET },
});


app.webhooks.on("issues.opened", async ({ octokit, payload }) => {
    const { repository, issue, sender } = payload;
    const user = await getUserByProviderId(sender.id)
    if (issue.author_association ==="OWNER" && issue.user.login === user.username) {
        if (isUserSubscribed(user.id)) {
            await requestIssueMessage(octokit, payload);
        } else {
            await createIssueComment(
                octokit,
                repository.owner.login,
                repository.name,
                issue.number,
                'You do not have a valid subscription / account with LlamaAI, you can subscribe to this application at https://llamaai.dev/'
            )
        }
    } else {
        await createIssueComment(
            octokit,
            repository.owner.login,
            repository.name,
            issue.number,
            'You do not have the correct permissions to let LlamaAI provide a solution to this issue.' +
            'You must be the repository owner and have a valid subscription / account with LlamaAI.' +
            'You can subscribe to this application at https://llamaai.dev/'
        )
    }
})

app.webhooks.on("issues.edited", async ({ payload }) => {
    const { issue } = payload;
    await updateIssue(issue.id, { title: issue.title, body: issue.body })
})

app.webhooks.on("issues.closed", async ({ payload }) => {
    const { issue } = payload;
    await updateIssue(issue.id, { open: false })
})

app.webhooks.on("issue_comment.created", async ({ octokit, payload}) => {
    const { comment, repository, issue, sender } = payload;
    if (!comment.author_association === "OWNER") {
        return;
    }
    if (comment.body === "Yes") {
        const user = await getUserByProviderId(sender.id)
        await createIssue({
            id: issue.id,
            userId: user.id,
            repo: repo,
            nodeId: issue.node_id,
            issueNumber: issueNumber,
            title: issue.title,
            body: issue.body,
            open: true,
        })
        await processAssignedIssue(octokit, payload)
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
