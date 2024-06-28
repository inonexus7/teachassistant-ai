import { Grid, Typography } from "@mui/material";
import React, { FC } from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ChatbotItem } from "@/interfaces/chatbotItem";
import { NextRouter, useRouter } from "next/router";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

interface Props {
    payload: ChatbotItem
}

const ChatbotItemCard: FC<Props> = ({ payload }) => {
    const router: NextRouter = useRouter()

    const goToChatbot = () => {
        const data: ChatbotItem = payload
        router.push({
            pathname: '/chatbot',
            query: { id: data.title }
        })
    }

    return (<Grid className="fade_up" item xs={12} sm={6} md={6} lg={4}>
        <Item sx={{
            padding: 2,
            minHeight: 213,
            background: 'transparent',
            color: '#fff',
            cursor: 'pointer'
        }} className="chatbot_item_btn" onClick={goToChatbot}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%'
                }}>
                    <img style={{ borderRadius: 5 }} src={payload.cover} width={70} height={70} alt={`chatbot_listitem_${payload.id}`} />
                    <Box sx={{ paddingX: 2, textAlign: 'left' }}>
                        <h2 style={{ margin: 0 }}>{payload.title}</h2>
                        <p style={{ fontSize: 20, margin: 0 }}>{payload.admin}</p>
                    </Box>
                </Box>
                <Box sx={{ marginTop: 1, textAlign: 'left' }}>
                    <Typography>{payload.text}</Typography>
                </Box>
            </Box>
        </Item>
    </Grid>)
}

export default ChatbotItemCard