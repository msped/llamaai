import { getSession } from 'next-auth/react';

export const useCurrentUser = () => {
    const session = getSession();

    return session.data?.user;
};