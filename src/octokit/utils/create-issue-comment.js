export default async function createIssueComment(octokit, owner, repo, issueNumber, body) {
    try {
        const response = await octokit.request(
            "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
            {
                owner,
                repo,
                issue_number: issueNumber,
                body
            }
        );
        console.log(`Comment created: ${response}`)
    } catch (error) {
        console.log(error)
        console.error(`Could not add comment: ${error}`)
    }
}