import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import SettingsIcon from '@mui/icons-material/Settings';

const Transition = React.forwardRef(function Transition(props,ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
            style={{
                border: '1px solid #e8e8e8',
                width: '100%',
                height: '100%',
            }}
        >
            {value === index && (
            <Box sx={{ p: 3 }}>
                <Typography>{children}</Typography>
            </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}


export default function FullScreenDialog() {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(0);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <React.Fragment>
        <Button
            variant="text"
            onClick={handleClickOpen}
            startIcon={<SettingsIcon fontSize="small"/>}
            sx={{
                color: '#fff'
            }}
        >
            Settings
        </Button>
        <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            fullWidth={true}
            maxWidth="lg"
            sx={{
                '& .MuiDialogContent-root': {
                    minHeight: '50vh',
                },
            }}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <Box
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        height: '100%',
                    }}
                >
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="Account Settings Tabs"
                        sx={{ borderRight: 1, borderColor: 'divider' }}
                    >
                        <Tab label="Account" {...a11yProps(0)} />
                        <Tab label="Delete Account" {...a11yProps(1)} />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        Account
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        Delete Account
                    </TabPanel>
                </Box>
            </DialogContent>
        </Dialog>
        </React.Fragment>
    );
}
