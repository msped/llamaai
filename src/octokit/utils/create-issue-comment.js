import getOctokit from "../octokit";

export default async function createIssueComment(owner, repo, issueNumber, body) {
    try {
        const response = await getOctokit.issues.createComment({
            owner,
            repo,
            issue_number: issueNumber,
            body
        });
        console.log(`Comment created: ${response.data.html_url}`)
    } catch (error) {
        console.error(`Could not add comment: ${error}`)
    }
}