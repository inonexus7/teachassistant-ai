import { Button, Grid, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/material';
// import ChatbotItemCard from '../../components/chatbot';
import Link from 'next/link';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useRouter, NextRouter } from 'next/router';
import { ChatbotItem } from '@/interfaces/chatbotItem';
import { FC, useState } from 'react';
import { Dashboard } from '@mui/icons-material';
import { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { data } from '@/components/chatbot'
import LessonPlan from '@/components/chatbot/lessonplan';

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

const Chatbot: FC = () => {
  const [lang, setLang] = useState('')
  const router: NextRouter = useRouter();

  console.log('searching...')

  const bot_id: any = router.query;
  const Bot = data.find(item => item.id === bot_id.id)?.data as unknown as FC

  const handleChange = (event: SelectChangeEvent) => {
    setLang(event.target.value);
  };

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
                  <Link href={`/home`}>
                    <BootstrapTooltip title="Dashboard">
                      <IconButton style={{ padding: 0, marginLeft: 10 }} color="primary" aria-label="dashboard">
                        <Dashboard style={{ fontSize: 32 }} />
                      </IconButton>
                    </BootstrapTooltip>
                  </Link>
                  <BootstrapTooltip title="Credit">
                    <Typography sx={{ textAlign: 'center', mx: 4, borderRadius: 10, border: '2px solid #333', padding: 1 }}><span style={{ fontWeight: 'bolder' }}>2 / 99</span></Typography>
                  </BootstrapTooltip>
                  <Typography sx={{ fontWeight: 100, border: '2px solid #333', borderRadius: 10, padding: 1 }}>Free plan</Typography>
                </Box>
              </Box>
              <Box
                padding={{ xs: 2, sx: 3, md: 10 }}
              >
                <Grid container>
                  <Bot />
                  <Grid item xs={12} sm={12} md={7} lg={8} style={{ background: '#fff', padding: 30 }} borderLeft={{ md: '1px solid #333' }}>Hi</Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}

export default Chatbot