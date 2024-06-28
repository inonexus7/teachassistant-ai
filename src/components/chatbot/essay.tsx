import { Grid, Typography } from "@mui/material";
import React, { FC, useState } from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ChatbotItem } from "@/interfaces/chatbotItem";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const Essay: FC = () => {
    const [lang, setLang] = useState('')

    const handleChange = (event: SelectChangeEvent) => {
        setLang(event.target.value);
    };

    const bot: ChatbotItem = {
        id: 3,
        cover: '/images/courses/3.AutomatedEssayScoringandFeedback-Elsa.png',
        title: 'Essay Grading',
        admin: 'Elsa',
        text: 'The Essay Grading bot evaluates essays, considering the question, grade level, and language, using default or custom rubrics for comprehensive assessment.',
        category: 'Assessment & Progress Monitoring'
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
            <TextField fullWidth label="Question" variant='standard' />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Essay Content" multiline rows={3} variant='standard' />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
            >
                Upload Essay
                <VisuallyHiddenInput type="file" />
            </Button>
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Rubric" multiline rows={3} variant='standard' />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
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

export default Essay