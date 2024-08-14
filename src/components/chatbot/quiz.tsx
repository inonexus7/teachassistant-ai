import { Alert, Grid, Snackbar, SnackbarCloseReason, Typography } from "@mui/material";
import React, { FC, useState } from "react";
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ChatbotItem, ChatbotProps } from "@/interfaces/chatbot";
import { serverUrl } from "@/config/development";
import { useAuthContext } from "@/contexts/auth-context";

const QUIZ: FC<ChatbotProps> = ({ clearAnswer, setAnswer }) => {
    const [data, setData] = useState({ lang: "English", grade: 1, quizType: "Multi-choice" })
    const [toast, setToast] = useState<boolean>(false);
    const [msg, setMsg] = useState<string>("");
    const auth = useAuthContext();

    if (!auth) {
        // process the context if the auth is null;
        throw new Error("Occured error to get context")
    }

    const { makingQuiz } = auth;

    const handleChange = (e: any): void => {
        const { name, value } = e.target

        setData({
            ...data,
            [name]: value
        })
    };

    const bot: ChatbotItem = {
        id: 2,
        cover: '/images/courses/2.Quiz-Qasim.png',
        title: 'General Quiz',
        admin: 'Qasim',
        text: 'QuizBot offers grade-specific quizzes on various subjects, with options like multiple-choice, true/false, and open-ended questions, fostering interactive learning in multiple languages.',
        category: 'Student Engagement & Activity Ideas'
    }

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ): void => {
        if (reason === 'clickaway') {
            return;
        }

        setToast(false);
    }

    const handleGenerate = async (): Promise<boolean> => {
        if (Object.keys(data).length < 6) {
            return false;
        } else {
            clearAnswer()
            try {
                // upgrading chat history
                makingQuiz().then(async () => {
                    const response: any = await fetch(`${serverUrl}/chatbot/quiz`, {
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
                        const reader = response.body.getReader();

                        const read = async (): Promise<void> => {
                            const { done, value } = await reader.read();

                            if (done) {
                                // All data has been received
                                console.log('Stream finished');
                                // answer = answer.replace(/Wait a moment.../g, '');
                            } else {
                                let text = new TextDecoder().decode(value)

                                // Convert double asterisks to bold
                                text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

                                // Convert single asterisks to italic
                                text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

                                // Convert new lines to paragraph tags
                                text = text.replace(/\n/g, '<br/>');

                                // Convert headers (lines starting with "###" to h3)
                                text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');

                                // Convert headers (lines starting with "##" to h2)
                                text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');

                                // Convert headers (lines starting with "#" to h1)
                                text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');

                                // Convert lists
                                text = text.replace(/^- (.*$)/gim, '<li>$1</li>');

                                // Wrap <li> elements with <ul>
                                text = text.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');

                                text = text.replace(/\n/g, '<br />');
                                // Regular expression to match URLs
                                const linkRegex = /\(\s*(https:\/\/[^\s)]+)\s*\)/;

                                // Replace link strings with <a> tags
                                const replacedString = text.replace(linkRegex, (match) => {
                                    let bmatch = match.replace(/[\[\]()]/g, '')
                                    bmatch = bmatch.replace(' ', '')
                                    return `  ${bmatch}`;
                                });

                                let newStr = replacedString.replace(/[\[(]http[^\])]+[\])]/g, (match) => {
                                    const string = match.replace(/[\[\]()]/g, '')
                                    return string
                                })

                                newStr = newStr.replace(/http:\/\/[^\s]+/g, (match) => {
                                    return `  <a href='${match}' target='_blank' style={{color: 'blue'}}>${match}</a>`
                                })
                                newStr = newStr.replace(/https:\/\/[^\s]+/g, (match) => {
                                    return `  <a href='${match}' target='_blank' style={{color: 'blue'}}>${match}</a>`
                                })

                                text = newStr.replace(/```html|```/g, '')
                                // text = newStr.replace(/\n/g, '<br />');
                                // text = newStr.replace("<br/>", "")
                                setAnswer(text)
                                // console.log('Received chunk:', text);

                                // Call read() again to receive the next chunk
                                read();
                            }
                        };

                        read();
                    } else {
                        console.error('Error:', response.status, response.statusText);
                        // toast('Something Wrong!')
                        alert("something went wrong")
                        // Handle any errors from the request
                    }
                }).catch(() => {
                    setToast(true)
                    setMsg("You got some error!")
                })
            } catch (error) {
                const err: any = error;
                if (err?.response?.status === 429) {
                    // toast(error?.response?.data?.error)
                    alert("error!")
                }
                console.log('Error: ', error);
                // Handle any network or other errors
            }
        }
        return true;
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
            <TextField fullWidth label="Grade Level" type="number" variant='standard' name="grade" onChange={handleChange} defaultValue={1} />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Quiz Topic" variant='standard' name="topic" onChange={handleChange} />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Subject" variant='standard' name="subject" onChange={handleChange} />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Short Summary Learning Objectives" multiline rows={3} variant='standard' name="summaryLearningObjectives" onChange={handleChange} />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <FormControl fullWidth variant="standard">
                <InputLabel id="demo-simple-select-standard-quiztype">Quiz Type</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-quiztype"
                    id="demo-simple-select-quiztype"
                    onChange={handleChange}
                    label="Quiz Type"
                    name="quizType"
                    defaultValue={`Multi-choice`}
                >
                    <MenuItem value={`Multi-choice`}>Multiple-Choice Questions</MenuItem>
                    <MenuItem value={`True or False`}>True or False</MenuItem>
                    <MenuItem value={`Short Answer`}>Short Answer</MenuItem>
                </Select>
            </FormControl>
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Number of Questions" type="number" variant='standard' name="numberOfQuestions" onChange={handleChange} />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <FormControl fullWidth variant="standard">
                <InputLabel id="demo-simple-select-standard-label">Language</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    onChange={handleChange}
                    label="Language"
                    name="lang"
                    defaultValue={`en`}
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

export default QUIZ