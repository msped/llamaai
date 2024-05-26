"use client"

import { signOutAction } from "@/actions/auth/authActions";
import Button from "@mui/material/Button";
import LogoutIcon from '@mui/icons-material/Logout';

export function LogoutButton() {

    const handleSubmit = async () => {
        await signOutAction();
    }

    return (
        <form onSubmit={handleSubmit}>
            <Button 
                type="submit" 
                startIcon={<LogoutIcon fontSize="small" />}
                sx={{
                    color: '#fff'
                }}
            >
                Logout
            </Button>
        </form>
        
    );
}