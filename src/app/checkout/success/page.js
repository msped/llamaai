'use client'

import {
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    Stack,
} from '@mui/material';
import Image from 'next/image';

export default function CheckoutSuccess() {

    return (
        <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography variant="h4" fontWeight={700}>Checkout Successful!</Typography>
            <Card sx={{ maxWidth: '600px', margin: 'auto', mt: 4, boxShadow: 'none'}}>
                <CardContent>
                    <Stack spacing={3}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Image src="/llama-eating.webp" alt="Success" width={150} height={150} />
                        </Box>
                        <Typography variant="h6" fontWeight={600}>Thank you for your purchase!</Typography>
                        <Typography variant="body1">
                            Your subscription has been activated and you can manage your subscription by clicking the profile button.
                        </Typography>
                        <Button variant="contained" sx={{ mt: 4 }} href="/dashboard">
                            Go to Dashboard
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
