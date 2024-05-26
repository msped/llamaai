import { db } from '@/db/index';

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
        const user = await db.users.findUnique({ where: { id } });

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
        const user = await db.users.update({ where: { id }, data });

        return user;
    } catch {
        return null;
    }
};
