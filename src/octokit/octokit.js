import { Octokit } from "@octokit/rest";
import { auth } from "@/auth";

async function getOctokit() {
    const { access_token } = await auth();
    const octokit = new Octokit({
        auth: access_token,
    });
    return octokit;
}

export default getOctokit;