import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/material';
import { chatbots_items } from './chatbots-data';
import ChatbotItemCard from '../../components/chatbot';
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react';
import { ChatbotItem } from '../../interfaces/chatbotItem'

const Home: FC = () => {
  const [chatbots, setChatbots] = useState<ChatbotItem[]>([])
  const [timerRefs, setTimerRefs] = useState<any>([]);

  useEffect(() => {
    let delay = 600;
    const newTimerRefs: any = [];

    chatbots_items.forEach(item => {
      const timerId = setTimeout(() => {
        setChatbots(chatbots => chatbots.concat(item))
      }, delay)
      delay += 600
      newTimerRefs.push(timerId)
    })

    setTimerRefs(newTimerRefs);

    return () => {
      timerRefs.forEach((timerId: any) => clearTimeout(timerId));
    };
  }, [])

  return (
    <Grid container spacing={2}>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          minWidth: '100vw',
          minHeight: '100vh',
          background: '#000',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            padding: 5,
            width: '100%',
            height: '100%',
            minWidth: '100vw',
            minHeight: '100vh',
            background: `url('/images/home/login.jpeg') no-repeat center center`,
            backgroundSize: 'cover',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.3
          }}
        >
        </Box>
        <Box
          sx={{
            position: 'absolute',
            width: '80%',
            height: '80%',
            minWidth: '80vw',
            minHeight: '80vh',
            background: `url('/images/home/login.jpeg') no-repeat center center`,
            backgroundSize: 'cover',
            zIndex: 99
          }}
          className='effect_dark'
        >
          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                overflowX: 'hidden',
                overflowY: 'auto'
              }}
            >
              <Box
                sx={{
                  paddingY: 2,
                  background: '#fff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'sticky',
                  top: 0,
                  zIndex: 103
                }}
                paddingX={{ xs: 2, sx: 2, md: 5 }}
              >
                <Link href="/">
                  <Typography className='custom_font' sx={{ cursor: 'pointer' }} fontSize={{ xs: 18, sx: 25, md: 30 }}>TalentAssist</Typography>
                </Link>
                <Box sx={{ width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                  <Typography sx={{ textAlign: 'center', mx: 4, borderRadius: 10, border: '2px solid #333', padding: 1 }}><span style={{ fontWeight: 'bolder' }}>2 / 99</span></Typography>
                  <Typography sx={{ fontWeight: 100, border: '2px solid #333', borderRadius: 10, padding: 1 }}>Free plan</Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  color: '#fff'
                }}
                padding={{ xs: 2, sx: 3, md: 10 }}
              >
                <Box className='fade_left' sx={{ color: '#fff', display: 'flex', width: 'max-content' }} fontSize={{ xs: 30, sx: 40, md: 60 }}>Educational Chatbots</Box>
                <Typography className='fade_up'>Which talentassist would you like?<br />Our innovative platform empowers you to effortlessly create guided notes from any YouTube video, regardless of its length. Utilizing advanced technology, we accurately summarize video content, enabling you to capture key information and insights in a condensed format. Take your learning to the next level with the option to generate custom questions based on the video, facilitating active engagement. Say goodbye to tedious note-taking and embrace the efficiency of video-based learning.</Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} paddingX={{ xs: 2, md: 3, lg: 10 }}>
                  {chatbots.map(item => (<ChatbotItemCard key={`chatbot_card_${item.id}`} payload={item}></ChatbotItemCard>))}
                </Grid>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}

export default Home