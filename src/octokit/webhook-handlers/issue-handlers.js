import { processAssignedIssue } from "@/octokit/gh_utils";
import { updateIssue } from "@/octokit/gh_utils";
import createIssueComment from "../utils/create-issue-comment";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { isUserSubscribed } from "@/lib/isUserSubscribed";


export default async function IssueWebhookHandlers(payload, action, issue, repository) {
    const user = await useCurrentUser();
    const owner = repository.owner.login;

    if (action === 'assigned') {
        // Check if a GitHub user has a subscription / account to Llama
        if (issue.assignee.login === repository.owner.login && issue.assignee.login === user.username) {
            if (isUserSubscribed(user.id)) {
                await processAssignedIssue(payload);
            } else {
                await createIssueComment(
                    owner,
                    repository,
                    issue.number,
                    'You do not have a valid subscription / account with LlamaAI, you can subscribe to this application at https://llamaai.dev/'
                )
            }
        } else {
            
            await createIssueComment(
                owner,
                repository,
                issue.number,
                'You do not have the correct permissions to assign Llama to this issue. \
                The assignee must be the repository owner and have a valid subscription / account with LlamaAI. \
                You can subscribe to this application at https://llamaai.dev/'
            )
        }
        
    }

    if (action === 'edited') {
        await updateIssue(issue.id, { title: issue.title, body: issue.body })
    }

    if (action === 'closed') {
        await updateIssue(issue.id, { open: false })
    }

}