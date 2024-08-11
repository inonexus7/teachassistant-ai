import { Alert, Grid, Snackbar, SnackbarCloseReason, Typography } from "@mui/material";
import React, { ChangeEvent, FC, useState } from "react";
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ChatbotItem, ChatbotProps } from "@/interfaces/chatbot";
import { serverUrl } from "@/config/development";
import { useAuthContext } from "@/contexts/auth-context";

const Presentation: FC<ChatbotProps> = ({ setAnswer, clearAnswer }) => {
    const [data, setData] = useState({ lang: "English", number_of_slides: 3, insert_image: 'simple' })
    const [toast, setToast] = useState<boolean>(false);
    const [msg, setMsg] = useState<string>("");
    const auth = useAuthContext();

    if (!auth) {
        // process the context if the auth is null;
        throw new Error("Occured error to get context")
    }

    const { makingQuiz } = auth;

    const handleChange = (e: any) => {
        const { name, value } = e.target

        setData({
            ...data,
            [name]: value
        })
    };

    const handleGenerate = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (Object.keys(data).length < 6) {
            return false;
        } else {
            // clearAnswer()
            try {
                // upgrading chat history
                makingQuiz().then(async (rlt) => {
                    const response: any = await fetch(`${serverUrl}/chatbot/powerpoint`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem("teachai_token")}`
                        },
                        body: JSON.stringify({
                            prompt: data,
                            language: data.lang
                        })
                    });

                    // Check if the response is successful (status code 200)
                    if (response.status === 200) {
                        const res_data = await response.json()
                        const download_url = res_data.presentation_link
                        const a = document.createElement('a');
                        a.href = `${serverUrl}/${download_url}`
                        a.download = 'presentation.pptx';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    } else {
                        console.error('Error:', response.status, response.statusText);
                        // toast('Something Wrong!')
                        alert("something went wrong")
                        // Handle any errors from the request
                    }
                }).catch(err => {
                    setToast(true)
                    setMsg("You got some error!")
                })
            } catch (error: any) {
                if (error?.response?.status === 429) {
                    // toast(error?.response?.data?.error)
                    alert("error!")
                }
                console.log('Error: ', error);
                // Handle any network or other errors
            }
        }
    }

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setToast(false);
    }

    const bot: ChatbotItem = {
        id: 9,
        cover: '/images/courses/10.PowerPointPresentationPriyanka.png',
        title: 'PowerPoint Presentation',
        admin: 'Priyanka',
        text: 'Create dynamic PowerPoint presentations effortlessly through the user-friendly inputs of the Presentation Bot, simplifying content delivery and engagement.',
        category: 'Digital Learning & Teaching Tools'
    }

    return (<Grid item sm={12} md={5} lg={4} style={{ background: '#fff', padding: 30 }}>
        <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <img src={bot.cover} width={70} height={70} alt='bot_avatar' />
            <Typography style={{ marginLeft: 5, fontSize: 22 }}>{bot.admin}</Typography>
        </Box>
        <Box style={{ borderBottom: '1px solid #333', padding: '5px 0' }}>
            <Typography variant='h3'>{bot.title}</Typography>
            <Typography>{bot.text}</Typography>
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Title" variant='standard' name="title" onChange={handleChange} />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Presented by" variant='standard' name="presenter" onChange={handleChange} />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Description" multiline rows={3} variant='standard' name="description" onChange={handleChange} />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Number of Slides" type="number" variant='standard' name="number_of_slides" onChange={handleChange} defaultValue={3} />
        </Box>
        <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">Choose a template:</FormLabel>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="insert_image"
                onChange={handleChange}
            >
                <FormControlLabel value="simple" control={<Radio />} label="Simple" />
                <FormControlLabel value="bright_modern" control={<Radio />} label="Bright Modern" />
                <FormControlLabel value="dark_modern" control={<Radio />} label="Dark Modern" />
            </RadioGroup>
        </FormControl>
        <Box sx={{ marginY: 2 }}>
            <FormControl fullWidth variant="standard">
                <InputLabel id="demo-simple-select-standard-label">Language</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    onChange={handleChange}
                    label="Language"
                    defaultValue="en"
                    name="lang"
                >
                    <MenuItem value={`en`}>English</MenuItem>
                    <MenuItem value={`fr`}>France</MenuItem>
                    <MenuItem value={`pt`}>Portuguese</MenuItem>
                </Select>
            </FormControl>
        </Box>
        <Box sx={{ marginTop: 3, marginBottom: 2 }}>
            <Button variant='contained' color='success' onClick={handleGenerate}>Generate</Button>
        </Box>
        <Snackbar open={toast} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={handleClose}
                severity="error"
                variant="filled"
                sx={{ width: '100%' }}>
                {msg}
            </Alert>
        </Snackbar>
    </Grid>)
}

export default Presentation