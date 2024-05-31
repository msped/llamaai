'use client'

import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Stack,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check';
import { isUserSubscribed } from '@/lib/isUserSubscribed';
import { signInAction } from '@/actions/auth/authActions';
import { generateStripeSessionAction } from '@/actions/stripe/stripeActions';
import { useCurrentUser } from '@/hooks/useCurrentUser';


const plans = [
    {
        title: 'Junior',
        description: 'Assign Llama to issues to get a pull request with an AI generated solution',
        price: 17.00,
        priceId: process.env.JUNIOR_PRICING_ID,
        features: [
            'Add Llama to an issue for a solution'
        ],
    },
    {
        title: 'Senior',
        description: 'Llama will act as your Senior Developer, taking a look at Issues and help with optimisations.',
        price: 30.00,
        priceId: process.env.SENIOR_PRICING_ID,
        features: [
            'Access to Junior features.',
            'Llama will check for optimisations or bugs'
        ],
    }
]

export default function PricingTable() {
    const user = useCurrentUser();
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        const getSubscriptionStatus = async () => {
            const subscriptionStatus = await isUserSubscribed(user.id);
            setSubscribed(subscriptionStatus);
        }
        if (user) {
            getSubscriptionStatus();
        }
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const planId = e.target.elements.plan.value;
        if (user) {
            await generateStripeSessionAction(planId)
        } else {
            await signInAction();
        }
    }

    return (
        <Box>
            <Typography 
                variant='h4' 
                component='h3'
                id='pricing'
                sx={{
                    textAlign: 'center',
                    my: 4,
                }}
            >
                Pricing
            </Typography>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: 3,
            }}>
            {plans.map((plan, index) => (
                <Card key={index}>
                    <CardContent sx={{
                        maxWidth: '300px',
                    }}>
                        <Stack spacing={2}>
                            <Typography variant="h5" fontSize='25px' component="h2" fontWeight={700}>
                                {plan.title}
                            </Typography>
                            <Typography mt={2} variant='subtitle2'>
                                {plan.description}
                            </Typography>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'baseline' }}>
                                £<Typography fontSize='3rem' fontWeight='700'>{plan.price}</Typography>/month
                            </Typography>
                            {subscribed ? (
                                <Typography variant="subtitle2" fontSize={12} textAlign='center'>
                                    Upgrade or cancel in your account settings
                                </Typography>
                            ) : (
                                <Box
                                    component='form'
                                    onSubmit={handleSubmit}
                                    sx={{ display: 'flex', width: '100%' }}
                                >
                                    <input
                                        type='hidden'
                                        name='plan'
                                        value={plan.priceId}
                                    />
                                    <Button 
                                        variant='contained' 
                                        sx={{
                                            backgroundColor: '#000',
                                            color: '#fff',
                                            width: '100%',
                                        }}
                                        type='submit'
                                    >
                                        Get Started
                                    </Button>
                                </Box>
                            )}
                            
                            <Typography>
                                This includes:
                            </Typography>
                            <List>
                                {plan.features.map((feature, index) => (
                                    <ListItem key={index}>
                                        <ListItemIcon>
                                            <CheckIcon fontSize='12pt'/>
                                        </ListItemIcon>
                                        <ListItemText sx={{ fontSize: '.5rem' }} primary={feature} />
                                    </ListItem>
                                ))}
                            </List>
                        </Stack>
                    </CardContent>
                </Card>
            ))}
            </Box>
        </Box>
    )
}
