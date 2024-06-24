"use client"

import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';

export const useCurrentUser = () => {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const loadUser = async () => {
            const session = await getSession();
            if (session) {
                setUser(session.user);
            }
        };

        loadUser();
    }, []); // The empty dependency array ensures this effect runs once on mount

    if (!user) return null;
    return user;
};