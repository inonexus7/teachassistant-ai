import { MainLayout } from "@/components/layout";
import { axiosApi } from "@/config/development";
import { useAuthContext } from "@/contexts/auth-context";
import { Alert, Box, Snackbar, SnackbarCloseReason, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

interface PlanType {
    title: string,
    price: number,
    items: string[]
}

const plans: PlanType[] = [
    {
        title: '7-Days Trial',
        price: 0,
        items: [
            "Access to only a number of Chatbots",
            "Free 5 chat requests per day",
            "1 member",
            "Write in 30+ languages"
        ]
    },
    {
        title: 'Starter',
        price: 9.99,
        items: [
            "Access to All the Chatbots",
            "20 chat requests per day",
            "1 member seat",
            "Write in 30+ languages",
            "24/7 live chat support",
            "All Grade Levels"
        ]
    },
    {
        title: 'Professional',
        price: 14.99,
        items: [
            "Access to All the Chatbots",
            "50 chat requests per day",
            "1 member seat",
            "Write in 30+ languages",
            "24/7 live chat support",
            "Access to chat history",
            "Extract responses to word document/pdf",
            "All Grade Levels"
        ]
    }
]

const Price: FC = () => {
    const [currentPlan, setCurrentPlan] = useState<number>(0);
    const [toast, setToast] = useState<boolean>(false);
    const [msg, setMsg] = useState<string>("");
    const router = useRouter()
    const auth = useAuthContext()

    if (!auth) {
        throw new Error("auth provide error")
    }

    const { plan, user, isAuthenticated } = auth;

    useEffect(() => {
        const current = plan == 'Free' ? 0 : plan == 'Starter' ? 1 : 2
        setCurrentPlan(current)
    }, [plan])

    const handlePlan = async (plan: PlanType, idx: number) => {
        if (currentPlan == idx) {
            // clicking current plan and skip it
            return false;
        }
        if (!isAuthenticated) {
            setToast(true)
            setMsg("You should login first before upgrading your plan!")
            return false;
        }
        // process upgrading plan
        try {
            const rlt = await axiosApi.post("/upgradingPlan", { plan, email: user.email });
            const pay_url = rlt.data.payUrl;
            window.open(pay_url, '_blank');
        } catch (err) {
            setToast(true);
            setMsg("Error! You got some error during upgrading your plan.");
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

    return <MainLayout>
        <Box color={`#394063`}>
            <Box sx={{ display: "flex", justifyContent: 'center', marginTop: 5 }}>
                <Typography fontSize={{ xs: 28, sm: 28, lg: 42 }} color={`#394063`}>Ignite Learning, Inspire Excellence!</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: 'center' }} paddingX={{ xs: 5, sx: 5, md: 10, lg: 20 }} paddingY={10}>
                <Typography color={`#394063`} fontSize={18}>
                    Welcome to the pricing page for Teach Assist AI, a platform designed specifically for teachers and schools. Our plans are tailored to meet the unique needs of educators at every level, from individual teachers to entire educational institutions. Craft your teaching experience perfectly, analyze student performance effortlessly, and engage with your students authentically using our powerful AI technology.
                    <br /><br />
                    We offer a range of plans to accommodate different requirements and budgets. Whether you're a new teacher, an experienced educator, or a school administrator, we have the right plan for you. Additionally, if you have specific needs or require a custom plan, our team is here to collaborate with you and find the best solution.
                    <br /><br />
                    We understand the importance of personalized support in the education sector. If you need any assistance or have questions regarding our plans, please do not hesitate to reach out to us. We're dedicated to helping teachers and schools succeed with Teach Assist AI.
                    <br /><br />
                    Curious about the price? We charge for our Full Access Plan to cover the expenses of providing our AI services. Our API enables us to utilize AI effectively in meeting your teaching requirements. By subscribing to the Full Access Plan, you not only gain unrestricted access to our cutting-edge teaching tools but also contribute to the enhancement of this exceptional service. Your support helps us sustain the API's cost, guaranteeing a reliable and efficient platform for educators. We appreciate your understanding and support as we empower teachers and enhance education with Teach Assist AI technology.
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginY: 4 }}>
                <Typography fontSize={{ xs: 18, sx: 22, md: 28 }} sx={{ fontWeight: 800, fontSize: '2.25rem' }}>
                    Start your 7-days free trial
                </Typography>
                <Typography sx={{ paddingX: { xs: 5, sm: 2 }, textAlign: 'center' }}>
                    No payment information needed, Change Plans Anytime. Cancel at any time
                </Typography>
            </Box>
            <Box sx={{ display: { xs: 'block', sm: 'block', md: 'flex' }, justifyContent: 'center', marginBottom: 8 }}>
                {
                    plans.map((item, i) => (<Box onClick={() => i > 0 && handlePlan(item, i)} className="plan_item" key={`plan_${i}`} sx={{ backgroundColor: '#ffffff', margin: 3, minHeight: 550, minWidth: 400, padding: 3 }}>
                        {currentPlan == i && <div className="currentPlan"></div>}
                        <Box sx={{ textAlign: 'center', paddingTop: 3 }}>
                            <Typography sx={{ fontSize: '1.5rem', fontWeight: 600 }}>{item.title}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', borderBottom: '2px solid #777', paddingY: 4 }}>
                            <Typography sx={{ fontSize: '3rem', fontWeight: 800 }}>
                                {item.price == 0 ? 'Free' : `$${item.price}`}
                                {item.price > 0 && <span style={{ fontSize: '1rem', fontWeight: 300 }}> / month</span>}
                            </Typography>
                        </Box>
                        <Box sx={{ paddingY: 3 }}>
                            {
                                item.items.map((text, idx) => <Box key={`plan_${i}_${idx}`} sx={{ display: 'flex', paddingY: 1 }}>
                                    <span style={{ marginRight: 12 }}>
                                        <svg style={{ width: 20, height: 20 }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                    </span>
                                    <Typography sx={{ fontSize: { xs: '1.4rem', sm: '1.2rem' } }}>{text}</Typography>
                                </Box>)
                            }
                        </Box>
                    </Box>))
                }
            </Box>
        </Box>
        <Snackbar open={toast} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={handleClose}
                severity="error"
                variant="filled"
                sx={{ width: '100%' }}>
                {msg}
            </Alert>
        </Snackbar>
    </MainLayout>
}

export default Price;