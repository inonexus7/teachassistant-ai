import { Alert, Grid, Snackbar, SnackbarCloseReason, Typography } from "@mui/material";
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
import { ChatbotItem, ChatbotProps } from "@/interfaces/chatbot";
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

const Essay: FC<ChatbotProps> = ({ clearAnswer, setAnswer }) => {
    const [data, setData] = useState<any>({ lang: 'en', grade: 1 })
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [content, setContent] = useState<any>('');
    const [contentCount, setContentCount] = useState<any>(0)

    const [rubric, setRubric] = useState<any>('');
    const [rubricCount, setRubricCount] = useState<any>(0)

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
        id: 3,
        cover: '/images/courses/3.AutomatedEssayScoringandFeedback-Elsa.png',
        title: 'Essay Grading',
        admin: 'Elsa',
        text: 'The Essay Grading bot evaluates essays, considering the question, grade level, and language, using default or custom rubrics for comprehensive assessment.',
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
            console.log("extract from pdf...")
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
                const name = 'essayContent'

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
                console.log("doc text: ", textContent)
                const wordCount = countWords(textContent);
                const name = 'essayContent'

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
        const name = 'essayContent'

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

        clearAnswer()
        let fileMB = 0
        if (selectedFile) {
            fileMB = selectedFile.size / 1024 / 1024
        }
        if (fileMB > 5) {
            alert('File should not be larger than 5mb')
            return;
        }

        try {
            // upgrading chat history
            makingQuiz().then(async (rlt) => {
                const response: any = await fetch(`${serverUrl}/chatbot/gradeEssay`, {
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
            }).catch(err => {
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
            <TextField fullWidth label="Grade Level" type="number" variant='standard' name="grade" onChange={handleChange} defaultValue={1} />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Question" variant='standard' name="question" onChange={handleChange} />
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Essay Content" value={content} multiline rows={3} variant='standard' name="essayContent" onChange={(e: any) => handleTextAreaChange(e, setContent, setContentCount)} />
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
                Upload Essay
                <VisuallyHiddenInput type="file" accept='.pdf, .doc, .docx, .txt' onChange={handleFileChange} />
            </Button>
        </Box>
        <Box sx={{ marginY: 2 }}>
            <TextField fullWidth label="Rubric" value={rubric} multiline rows={3} variant='standard' name="rubric" onChange={(e) => handleTextAreaChange(e, setRubric, setRubricCount)} />
            <p style={{ textAlign: "right" }}>
                {rubricCount} / {maxWords}
            </p>
        </Box>
        <Box sx={{ marginY: 2 }}>
            <FormControlLabel control={<Checkbox defaultChecked onChange={(e: any) => {
                if (e.target.checked) {
                    setData({ ...data, "rubric": 'default' })
                    // generateRubric();
                } else {
                    console.log('rubric not default')
                    setData({ ...data, "rubric": '' })
                    setRubric('')
                }
            }} />} label="Use default" />
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

export default Essay