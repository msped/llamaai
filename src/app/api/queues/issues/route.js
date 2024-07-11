import { Queue } from "quirrel/next-app";
import { processAssignedIssue } from "@/octokit/gh_utils";
import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";

export const issuesQueue = Queue(
    "api/queues/issues",
    async (job) => {
        const { payload } = job;
        const installationId = payload.installation.id;
        const octokit = new Octokit({
            authStrategy: createAppAuth,
            auth: {
                appId: process.env.GITHUB_APP_ID,
                privateKey: process.env.GITHUB_PRIVATE_KEY,
                installationId: installationId,
            },
        });

        await processAssignedIssue(octokit, payload);
    }
);

export const addToIssuesQueue = async (payload) => {
    const existingJob = issuesQueue.get(payload.issue.node_id);
    if (existingJob) {
        return;
    }
    await issuesQueue.enqueue({ payload })
}

export const removeFromIssuesQueue = async (payload) => {
    const existingJob = issuesQueue.get(payload.issue.node_id);
    if (!existingJob) {
        return;
    }
    await issuesQueue.delete(payload.issue.node_id);
}

export const POST = issuesQueue;