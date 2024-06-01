import React, { useState, useEffect } from 'react'
import { redirect } from 'next/navigation';
import Button from '@mui/material/Button';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { createBillingPortalAction } from '@/actions/stripe/stripeActions';
import { isUserSubscribed } from '@/lib/isUserSubscribed';
import MenuItem from '@mui/material/MenuItem';


export default function ManageAccountsButton({ userId }) {
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        const checkSubscription = async () => {
            const isSubscribed = await isUserSubscribed(userId);
            setSubscribed(isSubscribed);
        };
        checkSubscription();
    }, [userId])



    const handleSubmit = async (event) => {
        event.preventDefault();
        await createBillingPortalAction(userId);
    }

    if (!subscribed) return null


    return (
        <MenuItem>
        <form onSubmit={handleSubmit}>
            <Button 
                type="submit"
                startIcon={<ManageAccountsIcon fontSize="small" />}
                sx={{
                    color: '#fff',
                }}
            >
                Manage Subscription
            </Button>
        </form>
        </MenuItem>
    );
}
