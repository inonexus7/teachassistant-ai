import { Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/material';
// import ChatbotItemCard from '../../components/chatbot';
import Link from 'next/link';
import { useRouter, NextRouter } from 'next/router';
import { AIWritingDetectChatbotProps, ChatbotProps } from '@/interfaces/chatbot';
import { FC, useState } from 'react';
import { Dashboard } from '@mui/icons-material';
import { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { data } from '@/components/chatbot'
import DetectDonutChart, { PlagDonutChart } from '@/components/Donut/DonutChart'
import { useAuthContext } from '@/contexts/auth-context';
import { useEffect } from 'react'

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
  const [text, setText] = useState<string>('')
  const [detect, setDetect] = useState<boolean>(true);
  const [plag, setPlag] = useState<boolean>(true);
  const [detectAnswer, setDetectAnswer] = useState<any>(null);
  const [plagAnswer, setPlagAnswer] = useState<any>(null);
  const auth = useAuthContext()

  const router: NextRouter = useRouter();

  if (!auth) {
    // process the context if the auth is null;
    throw new Error("Occured error to get context")
  }

  const { bot, plan, isAuthenticated } = auth

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [router])

  let Bot: any = null
  let AIWritingDetectBot: any = null
  const bot_id: any = router.query;
  if (bot_id.id !== "Detect AI-Writing & Plagiarism") {
    Bot = data.find(item => item.id === bot_id.id)?.data as unknown as FC<ChatbotProps>
  } else {
    AIWritingDetectBot = data.find(item => item.id === bot_id.id)?.data as unknown as FC<AIWritingDetectChatbotProps>
  }

  const clearAnswer = (): void => {
    setText('')
  }

  const displayAnswer = (answer: string): void => {
    setText(text => text.concat(answer))
  }

  const setPlagFunc = (state: boolean): void => {
    setPlag(state)
  }

  const setDetectFunc = (state: boolean): void => {
    setDetect(state)
  }

  const setDetectAnswerFunc = (answer: any): void => {
    setDetectAnswer(answer)
  }

  const setPlagAnswerFunc = (answer: any): void => {
    setPlagAnswer(answer)
  }

  const renderPlagResult = (payload: any): string => {
    const a = `<h2>Average similarity: ${Math.floor(payload.plagia_score)}%</h2>`
    const b = payload.items.map((item: any) => `
      <h4>Plagiarism occurred in the following</h4>
      <a href='${item.candidates[0].url}' style={{color: 'blue'}}>${item.candidates[0].url}</a>
      <br/>
      <b>Similarity: ${Math.floor(item.candidates[0].plagia_score * 100)}%</b>
      <br/>
      <h3>Plagiarism occurred in the following sections:</h3>
      <p><b>Section:</b>${item.candidates[0].plagiarized_text}</p> 
    `).join('')
    return a + b
  }

  if (!Bot || !isAuthenticated) return null

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
                <Link href="/" passHref={true}>
                  <Typography className='custom_font' sx={{ cursor: 'pointer' }} fontSize={{ xs: 18, sx: 25, md: 30 }}>Teach Assist</Typography>
                </Link>
                <Box sx={{ width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                  <Link href={`/home`} passHref={true}>
                    <BootstrapTooltip title="Dashboard">
                      <IconButton style={{ padding: 0, marginLeft: 10 }} color="primary" aria-label="dashboard">
                        <Dashboard style={{ fontSize: 32 }} />
                      </IconButton>
                    </BootstrapTooltip>
                  </Link>
                  <BootstrapTooltip title="Credit">
                    <Typography sx={{ textAlign: 'center', mx: 4, borderRadius: 10, border: '2px solid #333', padding: 1, background: bot.current != bot.limit ? '#fff' : 'yellow' }}><span style={{ fontWeight: 'bolder' }}>{bot.current} / {bot.limit}</span></Typography>
                  </BootstrapTooltip>
                  <BootstrapTooltip title="Plan">
                    <Typography sx={{ fontWeight: 'bolder', border: '2px solid #333', borderRadius: 10, padding: 1 }}>{plan} plan</Typography>
                  </BootstrapTooltip>
                </Box>
              </Box>
              <Box
                padding={{ xs: 2, sx: 3, md: 10 }}
              >
                <Grid container>
                  {bot_id.id !== "Detect AI-Writing & Plagiarism" && <Bot setAnswer={displayAnswer} clearAnswer={clearAnswer} />}
                  {bot_id.id === "Detect AI-Writing & Plagiarism" && <AIWritingDetectBot plag={plag} detect={detect} clearAnswer={clearAnswer} setPlag={setPlagFunc} setDetect={setDetectFunc} setPlagAnswer={setPlagAnswerFunc} setDetectAnswer={setDetectAnswerFunc} />}
                  <Grid item xs={12} sm={12} md={7} lg={8} style={{ background: '#fff', padding: 30 }} borderLeft={{ md: '1px solid #333' }}>

                    {bot_id.id !== "Detect AI-Writing & Plagiarism" && <div dangerouslySetInnerHTML={{ __html: text }}></div>}
                    {bot_id.id === "Detect AI-Writing & Plagiarism" && <Box>
                      {
                        (detectAnswer || plagAnswer) && (<Box style={{ padding: 5 }}>
                          {
                            detect && detectAnswer && (<Box style={{ marginTop: 3 }}>
                              <Typography variant='h2'>Detect AI Percentage</Typography>
                              <Typography variant='h4'>The amount of detected is{" "}
                                {detectAnswer.status === 'success' &&
                                  Math.ceil(detectAnswer.ai_score * 100)}
                                %</Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5, marginBottom: 2 }}>
                                <Box style={{ width: '32px', height: '32px', backgroundColor: 'red' }}>
                                </Box>
                                <DetectDonutChart data={[
                                  {
                                    label: "Plagiarism",
                                    percentage:
                                      100 - Math.ceil(detectAnswer.ai_score * 100),
                                  },
                                  {
                                    label: "Detect AI",
                                    percentage: Math.ceil(detectAnswer.ai_score * 100),
                                  },
                                ]} />
                              </Box>
                            </Box>)
                          }
                          {
                            plag && plagAnswer && (<Box style={{ marginTop: 3 }}>
                              <Typography variant='h2'>Detect Plagiarism</Typography>
                              <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                {
                                  plagAnswer.status === 'success' && (<Box style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                      <Box style={{ width: '32px', height: '32px', backgroundColor: 'yellow' }}>
                                      </Box>
                                      <Typography variant='h3'>Plagerism Percentage</Typography>
                                    </Box>
                                    <PlagDonutChart
                                      data={[
                                        {
                                          label: "Detect AI",
                                          percentage: 100 - Math.floor(plagAnswer.plagia_score)
                                        },
                                        {
                                          label: "Plagiarism",
                                          percentage: Math.floor(plagAnswer.plagia_score),
                                        },
                                      ]}
                                    />
                                    {plagAnswer && (
                                      <div
                                        className=" prose text-sm"
                                        style={{ minWidth: "100%" }}
                                        dangerouslySetInnerHTML={{
                                          __html: renderPlagResult(plagAnswer)
                                        }}
                                      />
                                    )}
                                  </Box>)
                                }
                              </Box>
                            </Box>)
                          }
                        </Box>)
                      }
                    </Box>}
                  </Grid>
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