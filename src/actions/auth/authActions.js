"use server"

import { signIn, signOut } from "@/auth"

export const signInAction = async () => {
    "use server"
    await signIn('github');
}

export const signOutAction = async () => {
    "user server"
    await signOut();
}