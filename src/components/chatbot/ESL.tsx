import { Grid, Typography } from "@mui/material";
import React, { FC, useState } from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ChatbotItem, ChatbotProps } from "@/interfaces/chatbot";
import { serverUrl } from "@/config/development";

const ESL: FC<ChatbotProps> = ({ clearAnswer, setAnswer }) => {
    const [data, setData] = useState<any>({ lang: 'en', diff_level: 'starter', act_len: 3, act_format: 'fill_blank' })

    const handleChange = (e: any) => {
        const { name, value } = e.target

        setData({
            ...data,
            [name]: value
        })
    };

    const bot: ChatbotItem = {
        id: 11,
        cover: '/images/courses/12ESLActivitySuggestionAmira.png',
        title: 'ESL Activity Suggestion',
        admin: 'Amira',
        text: 'The ESL Activity Suggestion Chatbot aids ESL teachers and learners by suggesting custom activities focusing on language components and skill levels.',
        category: 'Special Education & Inclusive Practice'
    }

    const handleSubmit = async (e: any) => {

        clearAnswer()
        console.log(data)
        try {
            // /chatbot/gradeEssay

            const response: any = await fetch(`${serverUrl}/chatbot/esl/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("teachai_token")}`
                },
                body: JSON.stringify({
                    prompt: data,
                    language: data.lang
                }),
            });


            // Check if the response is successful (status code 200)
            if (response.status === 200) {
                const reader = response.body.getReader();
                let receivedChunks = [];

                let answer = '';

                const read = async () => {
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

                        // text = text.replace(/\n/g, '<br />');
                        // Regular expression to match URLs
                        const linkRegex = /\(\s*(https:\/\/[^\s)]+)\s*\)/;

                        // Replace link strings with <a> tags
                        const replacedString = text.replace(linkRegex, (match) => {
                            let bmatch = match.replace(/[\[\]()]/g, '')
                            bmatch = bmatch.replace(' ', '')
                            return `  ${bmatch}`;
                        });

                        let newStr = replacedString.replace(/[\[(]http[^\])]+[\])]/g, (match) => {
                            let string = match.replace(/[\[\]()]/g, '')
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
                        answer += text;
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
            <TextField fullWidth label="Language Component(s) (Eg: Nouns, Verbs, Adjectives)" variant='standard' name="lang_comp" onChange={handleChange} />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <FormControl fullWidth variant="standard">
                <InputLabel id="demo-simple-select-standard-label">Difficulty Level</InputLabel>
                <Select
                    labelId="demo-simple-select-difficulty"
                    id="demo-simple-select-difficulty"
                    onChange={handleChange}
                    label="diff_level"
                    name="diff_level"
                    defaultValue={`starter`}
                >
                    <MenuItem value={`starter`}>Beginner</MenuItem>
                    <MenuItem value={`medium`}>Intermediate</MenuItem>
                    <MenuItem value={`top`}>Advanced</MenuItem>
                </Select>
            </FormControl>
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Specify the Activity Type (Eg: Reading Comprehension or Vocabulary Exercise)" variant='standard' name="act_type" onChange={handleChange} />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Short Summary Learning Objectives" multiline variant='standard' name="user_prompt" onChange={handleChange} />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <FormControl fullWidth variant="standard">
                <InputLabel id="demo-simple-select-standard-label">Activity Format</InputLabel>
                <Select
                    labelId="demo-simple-select-activity-format"
                    id="demo-simple-select-activity-format"
                    onChange={handleChange}
                    label="act_format"
                    name="act_format"
                    defaultValue={`fill_blank`}
                >
                    <MenuItem value={`fill_blank`}>Fill in the blanks</MenuItem>
                    <MenuItem value={`multi_choice`}>Multiple-choice</MenuItem>
                    <MenuItem value={`comprehension`}>Comprehension</MenuItem>
                </Select>
            </FormControl>
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Number Questions" variant='standard' type="number" name="act_len" onChange={handleChange} defaultValue={3} />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <FormControl fullWidth variant="standard">
                <InputLabel id="demo-simple-select-standard-label">Language</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    onChange={handleChange}
                    label="lang"
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
            <Button variant='contained' color='success' onClick={handleSubmit}>Generate</Button>
        </Box>
    </Grid>)
}

export default ESL