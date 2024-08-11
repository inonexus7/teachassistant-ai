import React, { FC, useState } from 'react'
import Box from '@mui/material/Box'
import { Link as ScrollLink } from 'react-scroll'
import { navigations } from './navigation.data'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuthContext } from '@/contexts/auth-context'
import { Alert, Snackbar, SnackbarCloseReason, Link as MLink } from '@mui/material'

const Navigation: FC = () => {
  const [toast, setToast] = useState<boolean>(false);

  const router = useRouter();
  const auth = useAuthContext();

  if (!auth) {
    // process the context if the auth is null;
    throw new Error("Occured error to get context")
  }

  const { isAuthenticated } = auth;

  const handleGoHome = (e: any) => {
    e.preventDefault()
    if (isAuthenticated) {
      router.push('/home')
    } else {
      // display warning msg
      setToast(true);
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

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      {navigations.map(({ path: destination, label }) => {
        if (destination == "/home") {
          return <Box
            component={ScrollLink}
            key={`navigation_${destination}`}
            activeClass="current"
            to={destination}
            spy={true}
            smooth={true}
            duration={350}
            sx={{
              position: 'relative',
              color: 'text.disabled',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: { xs: 0, md: 3 },
              mb: { xs: 3, md: 0 },
              fontSize: { xs: '1.2rem', md: 'inherit' },

              '& > div': { display: 'none' },

              '&.current>div': { display: 'block' },

              '&:hover': {
                color: 'primary.main',
                '&>div': {
                  display: 'block',
                },
              },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                transform: 'rotate(3deg)',
                background: 'transparent',
                '& img': { width: 44, height: 'auto' },
              }}
              onClick={handleGoHome}
            >
              {/* eslint-disable-next-line */}
              <img src="/images/headline-curve.svg" alt="Headline curve" />
            </Box>
            {/* <Button href='#home' onClick={handleGoHome}>{label}</Button> */}
            {/* <MLink onClick={handleGoHome} underline='none' sx={{
              color: 'text.disabled',
            }}>{label}</MLink> */}
            {label}
          </Box>
        }
        return <Link key={`navigation_${destination}`} href={destination}>
          <Box
            component={ScrollLink}
            key={destination}
            activeClass="current"
            to={destination}
            spy={true}
            smooth={true}
            duration={350}
            sx={{
              position: 'relative',
              color: 'text.disabled',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: { xs: 0, md: 3 },
              mb: { xs: 3, md: 0 },
              fontSize: { xs: '1.2rem', md: 'inherit' },

              '& > div': { display: 'none' },

              '&.current>div': { display: 'block' },

              '&:hover': {
                color: 'primary.main',
                '&>div': {
                  display: 'block',
                },
              },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                transform: 'rotate(3deg)',
                '& img': { width: 44, height: 'auto' },
              }}
            >
              {/* eslint-disable-next-line */}
              <img src="/images/headline-curve.svg" alt="Headline curve" />
            </Box>
            {label}
          </Box>
        </Link>
      })}
      <Snackbar open={toast} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleClose}
          severity="warning"
          variant="filled"
          sx={{ width: '100%' }}>
          You should login with your credential first.
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Navigation
