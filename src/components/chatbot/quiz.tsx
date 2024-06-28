import { Grid, Typography } from "@mui/material";
import React, { FC, useState } from "react";
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ChatbotItem } from "@/interfaces/chatbotItem";

const QUIZ: FC = () => {
    const [lang, setLang] = useState('')
    const [quizType, setQuizType] = useState('')

    const handleChange = (event: SelectChangeEvent) => {
        setLang(event.target.value);
    };

    const handleChangeQuizType = (e: SelectChangeEvent) => {
        setQuizType(e.target.value)
    }

    const bot: ChatbotItem = {
        id: 2,
        cover: '/images/courses/2.Quiz-Qasim.png',
        title: 'General Quiz',
        admin: 'Qasim',
        text: 'QuizBot offers grade-specific quizzes on various subjects, with options like multiple-choice, true/false, and open-ended questions, fostering interactive learning in multiple languages.',
        category: 'Student Engagement & Activity Ideas'
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
            <TextField fullWidth label="Grade Level" type="number" variant='standard' />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Quiz Topic" variant='standard' />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Subject" variant='standard' />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Short Summary Learning Objectives" multiline rows={3} variant='standard' />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <FormControl fullWidth variant="standard">
                <InputLabel id="demo-simple-select-standard-quiztype">Quiz Type</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-quiztype"
                    id="demo-simple-select-quiztype"
                    value={quizType}
                    onChange={handleChangeQuizType}
                    label="Quiz Type"
                >
                    <MenuItem value={`en`}>Multiple-Choice Questions</MenuItem>
                    <MenuItem value={`fr`}>True or False</MenuItem>
                    <MenuItem value={`pt`}>Short Answer</MenuItem>
                </Select>
            </FormControl>
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Number of Questions" type="number" variant='standard' />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <FormControl fullWidth variant="standard">
                <InputLabel id="demo-simple-select-standard-label">Language</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={lang}
                    onChange={handleChange}
                    label="Language"
                >
                    <MenuItem value={`en`}>English</MenuItem>
                    <MenuItem value={`fr`}>France</MenuItem>
                    <MenuItem value={`pt`}>Portuguese</MenuItem>
                </Select>
            </FormControl>
        </Box>
        <Box sx={{ marginTop: 3, marginBottom: 2 }}>
            <Button variant='contained' color='success'>Generate</Button>
        </Box>
    </Grid>)
}

export default QUIZ