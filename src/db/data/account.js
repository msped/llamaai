import { db } from '@/db/index';

export const getAccountByUsername = async (username) => {
    try {
        const account = await db.accounts.findFirst({
            where: { username },
        });

        return account;
    } catch {
        return null;
    }
};