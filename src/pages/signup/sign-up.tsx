import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuthContext } from '@/contexts/auth-context';
// import { useRouter } from 'next/router';
import { Alert, Snackbar, SnackbarCloseReason } from '@mui/material';

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="/">
                Teach Assist
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignUp() {
    // const router = useRouter();
    const [toast, setToast] = useState<boolean>(false);
    const [msg, setMsg] = useState<string>("");
    const auth = useAuthContext();

    if (!auth) {
        // process the context if the auth is null;
        throw new Error("Occured error to get context")
    }

    const { signUp } = auth;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const email: string = data != null ? data.get('email') as string : ''
        const password: string = data != null ? data.get('password') as string : ''
        const fullname: string = data != null ? `${data.get('firstName')} ${data.get('lastName')}` as string : ''
        const addr: string = data != null ? data.get('addr') as string : ''
        const phone: string = data != null ? data.get('phone') as string : ''
        const agree: boolean = data != null ? data.get('agree') == 'on' ? true : false : false;

        if (!email || !password || !data.get('firstName') || !data.get('lastName')) {
            setToast(true)
            setMsg("Pls check your info (email, password, fullname, ...)")
            return false;
        }

        if (agree) signUp(email, fullname, password, addr, phone);
        else {
            setToast(true)
            setMsg("Pls agree to the Terms & Conditions, Privacy Policy and Cookie Policy")
        }
    };

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setToast(false);
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box
                sx={{
                    padding: 5,
                    width: '100%',
                    height: '100%',
                    minWidth: '100vw',
                    minHeight: '100vh',
                    background: `url('/images/auth_bg.jpg') no-repeat center center`,
                    backgroundSize: 'cover',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Container style={{ background: `rgba(255, 255, 255, 0.95)`, padding: '5px 25px', borderRadius: 12 }} component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="firstName"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                        variant='standard'
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="family-name"
                                        variant='standard'
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        variant='standard'
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                        variant='standard'
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="addr"
                                        label="Address"
                                        type="text"
                                        id="addr"
                                        autoComplete="addr"
                                        variant='standard'
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="phone"
                                        label="Phone"
                                        type="tel"
                                        id="phone"
                                        autoComplete="phone"
                                        variant='standard'
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={<Checkbox value="on" color="primary" />}
                                        label="I agree to the Terms and Conditions, Privacy Policy, and Cookie Policy"
                                        name='agree'
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="/signin" variant="body2">
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Copyright sx={{ mt: 5, mb: 4 }} />
                </Container>
            </Box>
            <Snackbar open={toast} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}>
                    {msg}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}