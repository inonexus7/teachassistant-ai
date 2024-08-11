import { Alert, Grid, Snackbar, SnackbarCloseReason, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ChatbotItem, AIWritingDetectChatbotProps } from "@/interfaces/chatbot";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip'
import { serverUrl } from "@/config/development";
import { useAuthContext } from "@/contexts/auth-context";

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

const pdfjsLib: any = require('pdfjs-dist/webpack');
const Tesseract: any = require('tesseract.js');

function convertPdfToImagesAndReadText(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function () {
            const typedArray = new Uint8Array(this.result as Uint8Array);

            pdfjsLib.getDocument(typedArray).promise.then(function (pdf: any) {
                const totalPages = pdf.numPages;
                const imagePromises = [];

                for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
                    imagePromises.push(
                        pdf.getPage(pageNumber).then(function (page: any) {
                            const viewport = page.getViewport({ scale: 1.5 });
                            const canvas = document.createElement('canvas');
                            const context = canvas.getContext('2d');
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;

                            const renderContext = {
                                canvasContext: context,
                                viewport: viewport,
                            };

                            return page.render(renderContext).promise.then(function () {
                                return new Promise((resolve) => {
                                    canvas.toBlob(function (blob: any) {
                                        const reader = new FileReader();
                                        reader.onloadend = function () {
                                            resolve(this.result);
                                        };
                                        reader.readAsDataURL(blob);
                                    }, 'image/jpeg', 0.75);
                                });
                            });
                        })
                    );
                }

                Promise.all(imagePromises).then(function (imageDataArray) {
                    const textPromises: any = [];

                    imageDataArray.forEach(function (imageData) {
                        textPromises.push(
                            Tesseract.recognize(imageData, 'eng').then(function (result: any) {
                                return result.data.text;
                            })
                        );
                    });

                    Promise.all(textPromises).then(function (textArray) {
                        resolve(textArray);
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject);
        };
        reader.readAsArrayBuffer(file);
    });
}

const AIWritingDetect: FC<AIWritingDetectChatbotProps> = ({ detect, plag, clearAnswer, setDetect, setPlagAnswer, setDetectAnswer, setPlag }) => {
    const [data, setData] = useState<any>({ lang: 'en' })
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [content, setContent] = useState<any>('');
    const [contentCount, setContentCount] = useState<any>(0)
    const [toast, setToast] = useState<boolean>(false);
    const [msg, setMsg] = useState<string>("");
    const auth = useAuthContext();

    if (!auth) {
        // process the context if the auth is null;
        throw new Error("Occured error to get context")
    }

    const { makingQuiz } = auth;

    const maxWords = 1000;

    const handleChange = (e: any) => {
        const { name, value } = e.target

        setData({
            ...data,
            [name]: value
        })
    };

    const bot: ChatbotItem = {
        id: 8,
        cover: '/images/courses/9.DetectAI-Writing&Plagiarism-Ali.png',
        title: 'Detect AI-Writing & Plagiarism',
        admin: 'Ali',
        text: 'The Detect AI-Writing & Plagiarism Bot ensures originality by identifying AI-generated content and detecting plagiarism, maintaining academic integrity.',
        category: 'Assessment & Progress Monitoring'
    }

    const handleFileChange = async (e: any) => {
        setSelectedFile(e.target.files[0]);
        const file = e.target.files[0]
        let text = ''
        if (file === undefined) return
        if (file.type.includes("pdf")) {
            let extractedText = '';
            let read = false
            // Step 1: Read the uploaded PDF file
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);

            // Step 2: Wait for the file to be loaded
            await new Promise((resolve) => {
                reader.onload = resolve;
            });

            const pdfBytes = reader.result;

            // Step 3: Load the PDF using pdfjs-dist
            const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
            const pdf = await loadingTask.promise;

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const content = await page.getTextContent();
                const pageText = content.items.map((item: any) => item.str).join(' ');
                extractedText += pageText;
            }
            if (extractedText != '')
                read = true
            if (read == false) {

                await convertPdfToImagesAndReadText(file).then(function (textArray: any) {
                    extractedText = textArray[0]
                }).catch(function (error) {
                    console.error(error);
                });
            }
            text = extractedText
        }
        else if (file.type === 'text/plain') {
            const reader = new FileReader()
            reader.onload = async function (event: any) {
                const arrayBuffer = event.target.result
                // const byteString = new Uint8Array(arrayBuffer);

                // const textDecoder = new TextDecoder('utf-8');
                // const text = textDecoder.decode(arrayBuffer);
                const subStr = arrayBuffer.substring(arrayBuffer.indexOf('base64,') + 7)
                text = atob(subStr)
                const wordCount = countWords(text);
                const name = 'content'

                if (wordCount <= maxWords) {
                    setContentCount(wordCount)
                    setContent(text)
                    handleChange({ target: { name, value: text } })
                } else {
                    // Trim the excess words
                    setContentCount(1000)
                    let words = text.split(' ')
                    words = words.splice(0, maxWords);
                    let thaosandStr = words.join(' ')
                    setContent(thaosandStr);
                    handleChange({ target: { name, value: thaosandStr } })
                }
            }
            reader.readAsDataURL(e.target.files[0])
        } else if (file.name.endsWith('.docx')) {
            const reader = new FileReader()
            reader.onload = async function (e: any) {
                const arrayBuffer = e.target.result;
                const doc = new Docxtemplater().loadZip(new PizZip(arrayBuffer));
                const textContent = doc.getFullText();
                const wordCount = countWords(textContent);
                const name = 'content'

                if (wordCount <= maxWords) {
                    setContentCount(wordCount)
                    setContent(textContent)
                    handleChange({ target: { name, value: textContent } })
                } else {
                    // Trim the excess words
                    setContentCount(1000)
                    let words = textContent.split(' ')
                    words = words.splice(0, maxWords);
                    let thaosandStr = words.join(' ')
                    setContent(thaosandStr);
                    handleChange({ target: { name, value: thaosandStr } })
                }
            }
            reader.readAsArrayBuffer(file);
        }

        const wordCount = countWords(text);
        const name = 'content'

        if (wordCount <= maxWords) {
            setContentCount(wordCount)
            setContent(text)
            handleChange({ target: { name, value: text } })
        } else {
            // Trim the excess words
            setContentCount(1000)
            let words = text.split(' ')
            words = words.splice(0, maxWords);
            let thaosandStr = words.join(' ')
            setContent(thaosandStr);
            handleChange({ target: { name, value: thaosandStr } })
        }
    };

    const countWords = (text: string) => {
        let tt = text.split(' ');
        return tt.length;
    };

    const handleTextAreaChange = (e: any, fn: any, setCount: any) => {

        const { name } = e.target;
        const inputText = e.target.value;
        const wordCount = countWords(inputText);

        if (wordCount <= maxWords) {
            fn(inputText);
            setCount(wordCount)
            handleChange({ target: { name, value: inputText } })
        } else {
            // Trim the excess words
            setCount(1000)
            const words = inputText.split(' ');
            const newWords = words.splice(0, maxWords);
            let thaosandStr = newWords.join(' ')
            fn(thaosandStr);
            handleChange({ target: { name, value: thaosandStr } })
        }
    };

    const handleSubmit = async (e: any) => {

        if (Object.keys(data).length < 2) {
            return false;
        }

        clearAnswer()
        if (!detect && !plag) {
            alert("Select the options SetectAI/Plagirism")
            return;
        }

        try {
            //
            makingQuiz().then(async (rlt) => {
                if (detect) {
                    // setLoading(true)
                    const res: any = await fetch(`${serverUrl}/chatbot/detectai`, {
                        method: 'POST',
                        body: JSON.stringify({
                            body: data
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem("teachai_token")}`
                        }
                    })
                    const res_data = await res.json();
                    const rlt = res_data.answer.originalityai
                    setDetect(true);
                    setDetectAnswer(rlt)
                }

                if (plag) {
                    // setLoading(true)
                    const res: any = await fetch(`${serverUrl}/chatbot/plagirism`, {
                        method: 'POST',
                        body: JSON.stringify({
                            body: data
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem("teachai_token")}`
                        }
                    })
                    const res_data = await res.json();
                    const rlt = res_data.answer.winstonai
                    setPlag(true);
                    setPlagAnswer(rlt)
                }
            }).catch(err => {
                setToast(true)
                setMsg("You got some error!")
            })
        } catch (error: any) {
            console.log(error)
            // alert('Error While detecting your content')
            if (error?.response?.status === 429) {
                alert(error?.response?.data?.error)
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
            <TextField fullWidth label="Content" value={content} multiline rows={3} variant='standard' name="content" onChange={(e: any) => handleTextAreaChange(e, setContent, setContentCount)} />
            <p style={{ textAlign: "right" }}>
                {contentCount} / {maxWords}
            </p>
        </Box>
        <Box sx={{ marginY: 2 }}>
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
            >
                Import from a file
                <VisuallyHiddenInput type="file" accept='.pdf, .doc, .docx, .txt' onChange={handleFileChange} />
            </Button>
        </Box>
        <Box sx={{ marginY: 2 }}>
            <FormControlLabel control={<Checkbox defaultChecked onChange={(e: any) => {
                if (e.target.checked) {
                    setDetect(true)
                    // generateRubric();
                } else {
                    setDetect(false)
                }
            }} />} label="Detect AI" />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <FormControlLabel control={<Checkbox defaultChecked onChange={(e: any) => {
                if (e.target.checked) {
                    setPlag(true)
                    // generateRubric();
                } else {
                    setPlag(false)
                }
            }} />} label="Plagirism" />
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

export default AIWritingDetect