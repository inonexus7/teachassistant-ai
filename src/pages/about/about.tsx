import { MainLayout } from "@/components/layout";
import { Category, ChatbotItem } from "@/interfaces/chatbot";
import { categories, chatbots_items } from "@/utils/chatbots-data";
import { Box, Typography, Grid } from "@mui/material";
import { FC } from "react";

const About: FC = () => {

    return <MainLayout>
        <Box color={`#394063`} paddingX={{ xs: 5, sm: 5, md: 15 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
                <Typography sx={{ fontSize: '2.25rem', fontWeight: 800 }}>How can these AI Teachers help you?</Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 400, marginTop: 5, textAlign: 'center' }}>Our AI teachers revolutionize the process of creating outstanding classroom materials, freeing you from the burden of extensive research and design. Simply provide the desired topic, and our app will generate a diverse range of resources, including lesson plans, activities, worksheets, and more. With AI teachers at your disposal, preparing engaging materials has never been easier.</Typography>
            </Box>
            {
                categories.map((category: Category) => {
                    const filtered_bots: Array<ChatbotItem> = chatbots_items.filter((item: ChatbotItem) => item.category == category.title);
                    return <Box sx={{ borderBottom: '2px solid #333', paddingY: 3 }}>
                        <Typography sx={{ fontSize: '2.0rem', fontWeight: 600 }}>{category.title}</Typography>
                        <Typography sx={{ fontSize: '1.5rem', fontWeight: 400, marginY: 5 }}>{category.description}</Typography>
                        <Grid container sx={{ flexGrow: 1 }} spacing={5}>
                            {
                                filtered_bots.map((item: ChatbotItem, index: number) => <Grid item key={`bot_${category.title}_${index}`} xs={12} sm={6} md={4}>
                                    <Box sx={{ background: '#fff', padding: 3, borderRadius: 5, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                                        <Box sx={{ display: 'flex' }}>
                                            <img src={item.cover} width={50} height={50} />
                                            <Box sx={{ marginLeft: 5 }}>
                                                <Typography sx={{ fontWeight: 600, fontSize: '1.2rem' }}>{item.title}</Typography>
                                                <Typography sx={{ fontSize: '1.2rem' }}>{item.admin}</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ marginTop: 3 }}>
                                            <Typography sx={{ fontSize: '1.2rem' }}>{item.text}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>)
                            }
                        </Grid>
                    </Box>
                })
            }
            <Box sx={{ marginTop: 10 }}></Box>
        </Box>
    </MainLayout>
}

export default About;