import { styled } from '@mui/material/styles';
import { MainLayout } from "@/components/layout";
import { Alert, AlertColor, Box, Button, Grid, Snackbar, SnackbarCloseReason, TextField, Typography } from "@mui/material";
import Paper from '@mui/material/Paper';
import { useState, FC } from 'react';
import { axiosApi } from '@/config/development';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(4),
    textAlign: 'left',
    color: theme.palette.text.secondary,
}));

interface Notification {
    status: AlertColor;
    msg: string
}

const Contact: FC = () => {
    const [toast, setToast] = useState(false)
    const [alert, setAlert] = useState<Notification>({ status: 'info', msg: '' })

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<boolean> => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const email: string = data != null ? data.get('email') as string : ''
        const content: string = data != null ? data.get('content') as string : ''
        const fullname: string = data != null ? `${data.get('firstName')} ${data.get('lastName')}` as string : ''

        if (!email || !content || !data.get('firstName') || !data.get('lastName')) {
            setToast(true)
            setAlert({
                status: 'error',
                msg: 'Please fill the all forms!'
            })
            return false;
        }

        try {
            await axiosApi.post("/contact", { email, fullname, content })
            setToast(true)
            setAlert({ status: 'success', msg: 'Thanks for your message!' })
            return true;
        } catch (err) {
            setToast(true)
            setAlert({ status: 'error', msg: 'Error! Please try it again.' })
            return false;
        }
    }

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ): boolean => {
        if (reason === 'clickaway') {
            return false;
        }

        setToast(false);
        return true;
    }

    return <MainLayout>
        <Box sx={{ marginY: 10 }} paddingX={{ xs: 5, md: 20 }}>
            <Box sx={{ marginY: 5, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '2.25rem', fontWeight: 700 }}>Contact Us</Typography>
                <Typography sx={{ fontSize: '1.5rem' }}>Got a technical issue? Want to send feedback?</Typography>
                <Typography sx={{ fontSize: '1.5rem' }}>Need details about our business plan? Let us know.</Typography>
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Item>
                        <Typography sx={{ fontSize: '2.1rem', fontWeight: 600, marginBottom: 3 }}>
                            {`Got a question? Let's chat!`}
                        </Typography>
                        <Typography sx={{ marginBottom: 3 }}>
                            {`Our support team is here to help you with any questions or concerns you
                            may have, whether it's about using our tool, learning more about our plans
                            or anything else.`}
                        </Typography>
                        <Typography>
                            {`Our support team will get back to you within 24 hours. We're excited to
                            help you get the most out of Teach Assist AI.`}
                        </Typography>
                    </Item>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box component="form" noValidate onSubmit={handleSubmit}>
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
                                    name="content"
                                    label="How can We help you?"
                                    multiline
                                    id="content"
                                    rows={4}
                                    variant='standard'
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Send
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
        <Snackbar open={toast} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={handleClose}
                severity={alert.status}
                variant="filled"
                sx={{ width: '100%' }}>
                {alert.msg}
            </Alert>
        </Snackbar>
    </MainLayout>
}

export default Contact