/* eslint-disable react/no-unescaped-entities */

import {
    Container,
    Box,
    Stack,
    Typography,
    Grid,
} from '@mui/material'
import FeedbackIcon from '@mui/icons-material/Feedback';

export default function FirstSteps() {
    return (
        <Container maxWidth='lg'>
            <Grid container spacing={2} p={2}>
                {/* api key thing here */}
                <Grid item xs={12} md={6}>
                    <Stack display='inline-block' width='100%' justifyContent='center' alignItems='center' spacing={2}>
                        <Box width='100%' display='flex' flexWrap='nowrap' flexDirection='column' justifyContent='flex-start' alignItems='flex-start'>
                            {/* issue */}
                            <Typography fontWeight={600} variant='h4' component='h2'>
                                issue
                            </Typography>
                            <Typography variant='body1'>
                                create an issue, be sure to describe it in detail
                            </Typography>
                        </Box>
                        <Box width='100%' display='flex' flexWrap='nowrap' flexDirection='column'>
                            <Typography fontWeight={600} variant='h4' component='h2'>
                                brew
                            </Typography>
                            <Typography variant='body1'>
                                reply to LlamaAIdev(bot), put the kettle on and wait for a pull request 
                            </Typography>
                        </Box>
                        <Box width='100%' display='flex' flexWrap='nowrap' flexDirection='column' justifyContent='flex-start' alignItems='flex-start'>
                            {/* review */}
                            <Typography fontWeight={600} variant='h4' component='h2'>
                                review
                            </Typography>
                            <Typography variant='body1'>
                                review the pr, make changes, merge!
                            </Typography>
                        </Box>
                    </Stack>
                </Grid>
                <Grid container spacing={2} item xs={12} mt={2}>
                    <Grid item xs={12} md={8}>
                        <Stack spacing={2} direction='column'>
                            <Typography variant='h5' component='h3' fontWeight={600}>
                                <strong>Ugh</strong>, another AI app
                            </Typography>
                            <Typography variant='body1'>
                                I know, I know. As more and more people are using generative AI in daily tasks to save time,
                                its importance is becoming increasingly apparent. But let's be honest, sometimes you just want to 
                                throw your hands up in the air and scream "I'm tired of typing and committing!" so let us commit the
                                generation straight the repository.
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Stack spacing={1} direction='column'>
                            <Typography variant='h6' component='h4' fontWeight={600}>
                                We would love your feedback!
                            </Typography>
                            <Typography variant='body1'>
                                Improvements can only be made when flaws are known. When signed in, look for the <FeedbackIcon fontSize='12pt'/> symbol at the top of the page to provide us with feedback!
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>

        </Container>
    )
}
