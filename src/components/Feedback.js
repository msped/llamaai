'use client'

import React, { useState } from 'react'
import {
    Button,
    Dialog,
    DialogContent,
    TextField,
    Stack,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    AlertTitle,
} from '@mui/material';
import { feedbackAction } from '@/actions/feedback/feedbackAction';
import FeedbackIcon from '@mui/icons-material/Feedback';

export default function Feedback() {
    const [open, setOpen] = useState(false)
    const [label, setLabel] = useState('featureRequest')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const handleClick = () => {
        setOpen(!open)
    }

    const resetForm = (event) => {
        setOpen(false)
        setLabel('featureRequest')
        setError(null)
        setSuccess(false)
    }


    const handleChange = (event) => {
        setLabel(event.target.value)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);
        data.label = label;

        try {
            const response = await feedbackAction(JSON.stringify(data));

            if (response.status === 201) {
                setSuccess(true);
                setError(null);
                setTimeout(() => {
                    resetForm(event);
                }, 2500)
            } else {
                const errorData = await response.json();
                setError(errorData.message);
                setSuccess(false);
            }
        } catch (error) {
            setError(error.message);
            setSuccess(false);
        }
    }

    return (
        <React.Fragment>
            <Button onClick={handleClick}>
                <FeedbackIcon fontSize='small' />
            </Button>
            <Dialog 
                open={open} 
                onClose={() => setOpen(false)} 
                maxWidth={'lg'}
            >
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <Typography variant='h5' align='center'>
                                Provide us with your feedback
                            </Typography>
                            {!success ? ( <>
                            <TextField
                                name="name"
                                label="Name"
                                type="text"
                                size="small"
                                required
                                InputLabelProps={{
                                    style: { color: '#000' },
                                }}
                            /> 
                            <TextField
                                name="email"
                                label="Email"
                                type="email"
                                size="small"
                                required
                                InputLabelProps={{
                                    style: { color: '#000' },
                                }}
                            />
                            <FormControl fullWidth size="small">
                                <InputLabel id="demo-simple-select-label" sx={{color: '#000'}}>Label</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={label}
                                    label="Label"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={'idea'}>Idea</MenuItem>
                                    <MenuItem value={'issue'}>Issue</MenuItem>
                                    <MenuItem value={'question'}>Question</MenuItem>
                                    <MenuItem value={'complaint'}>Complaint</MenuItem>
                                    <MenuItem value={'featureRequest'}>Feature Request</MenuItem>
                                    <MenuItem value={'other'}>Other</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField 
                                name="feedback"
                                label="Feedback"
                                multiline
                                rows={4}
                                size="small"
                                required
                                InputLabelProps={{
                                    style: { color: '#000' },
                                }}
                            />
                            <input style={{
                                opacity: 0,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: 0,
                                width: 0,
                                zIndex: -1,
                            }} type="hidden" name="luckyllama"/>
                            </>) : (
                                <Alert severity="success">
                                    <AlertTitle>Success</AlertTitle>
                                    Your feedback has been submitted!
                                </Alert>
                            )}
                        </Stack>
                        {error && (
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                {error}
                            </Alert>
                        )}
                        <Stack spacing={2} direction='row' justifyContent='center' mt={2}>
                            <Button variant="contained" type="submit">Submit</Button>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: '#000', color: '#fff' }}
                                onClick={()=> setOpen(false)}
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </form>
                </DialogContent>
            </Dialog>

        </React.Fragment>
    )
}
