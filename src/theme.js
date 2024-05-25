'use client';

import { Bricolage_Grotesque } from 'next/font/google';

import { createTheme } from '@mui/material/styles';

const bric = Bricolage_Grotesque({ subsets: ["latin"] });

const theme = createTheme({
    palette: {
        primary: {
            main: '#fff',
            contrastText: '#000',
        },
        secondary: {
            main: '#ff1744',
            contrastText: '#fff',
        },
        background: {
            default: '#fff',
            paper: '#000'
        },
    },
    typography: {
        fontFamily: bric.style.fontFamily,
        button: {
            textTransform: "none", // Keeps button text in regular case for readability
        },
    },
    components: {
        // Customizations for specific components can go here
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8, // Rounded corners for buttons
                    color: '#000'
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined', // Consistent text field styling
                margin: 'normal',
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: '#000', // Consistent text color
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#fff',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root:{
                    "&.Mui-selected": {
                    backgroundColor: '#fff',
                    fontWeight: 'bold',
                    color: '#000'
                    }
                }
            }
        }
        // Additional component customizations can be added as needed
    },
});

export default theme;