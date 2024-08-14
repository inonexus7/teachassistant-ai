import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, FC } from 'react'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useAuthContext } from '@/contexts/auth-context';

const Success: FC = () => {
    const router = useRouter()
    const auth = useAuthContext()

    if (!auth) {
        throw new Error("auth error")
    }

    const { isAuthenticated } = auth;

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/')
        }

        setTimeout(() => {
            router.push("/")
        }, 5000)
    })

    if (!isAuthenticated) return null;

    return <Box sx={{ background: '#fff', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Box>
            <Typography sx={{ fontSize: '2.5rem', fontWeight: 800, display: 'flex', alignItems: 'center' }}>
                <VerifiedUserIcon color='primary' sx={{ fontSize: '2.5rem', marginRight: 2 }} />
                Congratulation!
            </Typography>
        </Box>
        <Box sx={{ marginTop: 5 }}>
            <Typography sx={{ fontSize: '1.6rem', color: '#555' }}>
                {`You've upgraded your plan. Take it mroe and hope to be helpful for you.`}
            </Typography>
        </Box>
        <Box sx={{ marginTop: 2 }}>
            <Typography>It will redirect you to the main page after 5 seconds.</Typography>
        </Box>
    </Box>
}

export default Success