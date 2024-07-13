"use client"

import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import Link from 'next/link';
import Stack from '@mui/material/Stack';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import SignedIn from "@/components/auth/SignedIn";
import SignedOut from "@/components/auth/SignedOut"
import UserButton from "@/components/auth/UserButton"
import { LoginButton } from './auth/Login';
import Feedback from './Feedback';

const menuContents = [
    {
        name: 'Pricing',
        link: '/#pricing'
    },
    { 
        name: 'Support',
        link: '/#support'
    }
]

const styles = {
    menuHamburger: {
        display: {
            xs: 'block',
            md: 'none'
        },
        cursor: 'pointer'
    },
}

export default function Header() {
    const theme = useTheme();

    const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

    const [menuHamburger, setMenuHamburger] = useState(false)

    const handleMenuNavigation = () => {
        setMenuHamburger(!menuHamburger)
    }

    const handleClickAway = () => {
        setMenuHamburger(false)
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <header sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Box onClick={handleMenuNavigation} sx={styles.menuHamburger}>
                            <MenuIcon sx={{ marginX: 2 }}/>
                        </Box>
                        <Link href='/' aria-label="Home">
                            <Image
                                src='/llamaai-v2.webp'
                                alt='LlamaAI'
                                height={60}
                                width={60}
                            />
                        </Link>
                        <Link href="/" aria-label='Home'>
                            <Typography
                                variant="h6"
                                sx={{ 
                                    flexGrow: 1,
                                }}
                                fontSize="1.5rem"
                                fontWeight={700}
                            >
                                LlamaAI
                            </Typography>
                        </Link>

                        {/* Menu Desktop View */}
                        {isDesktop ? ( <Stack 
                            sx={{
                                flexGrow: 1,
                                display: 'flex'
                                
                            }}
                            direction="row" 
                            spacing={2} 
                            justifyContent='center'
                        >
                            {menuContents.map((item, index) => (
                                <Link key={index} href={`/${item.link}`}>{item.name}</Link>
                            ))}
                        </Stack>): 
                        <Box sx={{ flexGrow: 1, display: {xs: 'flex', md: 'none'}}}></Box>}

                        {/* Account Settings Desktop View */}
                        <SignedIn>
                            <Stack direction='row' spacing={.5} justifyContent='center' alignItems='center'>
                                <Link href='/dashboard'>
                                    <SpaceDashboardIcon sx={{ 
                                        display: 'flex',
                                        justifyContent: 'center', 
                                        alignItems: 'center'
                                    }}/>
                                </Link>
                                <Feedback />
                                <UserButton />
                            </Stack>
                        </SignedIn>
                        
                        <SignedOut>
                            <Box sx={{ display: 'flex' }}>
                                <LoginButton />
                            </Box>
                        </SignedOut>
                    </Toolbar>

                    {/* Menu Mobile View */}
                    { !isDesktop && (
                    <Collapse 
                        in={menuHamburger}
                        aria-label='menu'
                        sx={{
                            minHeight: '200px',
                            backgroundColor: 'inherit'
                        }}
                    >
                        <Box sx={{
                            display: 'inline'
                        }}>
                            <List>
                                {menuContents.map((item, index) => (
                                    <ListItemButton key={index} component={Link} href={`/${item.link}`}>
                                        <ListItemText primary={item.name} />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Box>
                    </Collapse>)}
                </AppBar>
            </header>
        </ClickAwayListener>
    );
}