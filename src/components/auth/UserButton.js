import React from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { LogoutButton } from '@/components/auth/Logout';

import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import Settings from '@/components/auth/Settings'
import ManageAccountsButton from '@/components/auth/ManageAccountsButton'

export default function UserButton() {
    const user = useCurrentUser();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            <IconButton onClick={handleClick} sx={{ ml: 2 }}>
                <Avatar src={user?.image || ''}>
                    {!user?.image && <PersonIcon size="small" />}
                </Avatar>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                disableScrollLock={true}
                MenuListProps={{
                    'aria-labelledby': 'user-account-menu-button',
                }}
                sx={{
                    '& .MuiMenu-paper': {
                        backgroundColor: '#000',
                    }
                }}
            >
                <ManageAccountsButton userId={user?.id} />
                <MenuItem>
                    <Settings />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <LogoutButton />
                </MenuItem>
            </Menu>
        </ React.Fragment>
    );
}
