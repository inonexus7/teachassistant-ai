import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, FC } from 'react'

const Failure: FC = () => {
    const router = useRouter()

    useEffect(() => {
        setTimeout(() => {
            router.push("/")
        }, 5000)
    })

    return <Box sx={{ background: '#fff', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Box>
            <Typography sx={{ fontSize: '2.5rem', fontWeight: 800 }}>You have failed!</Typography>
        </Box>
        <Box sx={{ marginTop: 5 }}>
            <Typography sx={{ fontSize: '1.6rem', color: '#555' }}>
                {`Don't worry. We will keep your plan and you can try to upgrade it.`}
            </Typography>
        </Box>
        <Box sx={{ marginTop: 2 }}>
            <Typography>It will redirect you to the main page after 5 seconds.</Typography>
        </Box>
    </Box>
}

export default Failure