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

const LessonPlan: FC = () => {
    const [lang, setLang] = useState('')

    const handleChange = (event: SelectChangeEvent) => {
        setLang(event.target.value);
    };

    const bot: ChatbotItem = {
        id: 1,
        cover: '/images/courses/1.LessonPlanning-Lisa.png',
        title: 'Lesson Planning',
        admin: 'Lisa',
        text: 'The lesson planner assistant chatbot optimizes teaching tasks, providing tailored and efficient support to enhance classroom productivity and organization.',
        category: 'Lesson Planning'
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
            <TextField fullWidth label="Topic" variant='standard' />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Grade Level" type="number" variant='standard' />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Lesson Duration" variant='standard' />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Subject" variant='standard' />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Key Learning Intention" variant='standard' />
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

export default LessonPlan