import { db } from '@/db/index';
import { eq } from 'drizzle-orm';
import { githubIssue } from '@/db/schema';


export const createIssue = async (data) => {
    try {
        const issue = await db.insert(githubIssue).values(data);
        return issue;
    } catch (error) {
        console.error(error);
    }
};

export const updateIssue = async (id, data) => {
    try {
        const issue = await db.update(githubIssue).set(data).where(eq(githubIssue.id, id));
        return issue;
    } catch (error) {
        console.error(error);
    }
}

export const deleteIssue = async (id) => {
    try {
        const issue = await db.delete(githubIssue).where(eq(githubIssue.id, id));
        return issue;
    } catch (error) {
        console.error(error);
    }
}
