import { db } from '@/db/index';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema';


export const getUserByUsername = async (username) => {
    try {
        const user = await db.users.findUnique({ where: { username } });

        return user;
    } catch {
        return null;
    }
};

export const getUserById = async (id) => {
    try {
        const user = await db.select().from(users).where(eq(users.id, id));
        return user;
    } catch {
        return null;
    }
};

export const createUser = async (data) => {
    try {
        const user = await db.users.create({
            data: {
                ...data,
            },
        });
        return user;
    } catch (error) {
        return null;
    }
};

export const updateUser = async (id, data) => {
    try {
        const user = await await db.update(users)
        .set(data)
        .where(eq(users.id, id));    

        return user;
    } catch {
        return null;
    }
};

export async function deleteUser(userId) {
    await db.delete(users).where(eq(users.id, userId))
}
