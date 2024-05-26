"use client"

import { Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { signInAction } from '@/actions/auth/authActions';

export function LoginButton() {

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signInAction();
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
            <Button type="submit" name="github" variant='contained' startIcon={<GitHubIcon />}>
                Login with GitHub
            </Button>
        </form>
    );
}