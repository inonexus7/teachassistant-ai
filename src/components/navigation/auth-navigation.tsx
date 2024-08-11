import React, { FC, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import { StyledButton } from '@/components/styled-button'
import { useAuthContext } from '@/contexts/auth-context'
import { Alert, Snackbar, SnackbarCloseReason } from '@mui/material'

const AuthNavigation: FC = () => {
  const [toast, setToast] = useState<boolean>(false);

  const auth = useAuthContext();

  if (!auth) {
    throw new Error("Invalid context")
  }

  const { isAuthenticated, user, signOut } = auth;

  const handleSignOut = () => {
    try {
      signOut();
      setToast(true)
    } catch (err) {
      console.log("Error");
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
    <Box sx={{ '& button:first-of-type': { mr: 2 } }}>
      {
        !isAuthenticated ? <><Link href={`/signin`}>
          <StyledButton disableHoverEffect={true} variant="outlined">
            Sign In
          </StyledButton>
        </Link>
          <Link href={`/signup`}>
            <StyledButton disableHoverEffect={true}>Sign Up</StyledButton>
          </Link></> : <>
          <StyledButton disableHoverEffect={true} variant="outlined" onClick={handleSignOut}>
            Sign Out
          </StyledButton>
          <StyledButton disableHoverEffect={true}>{user.name}</StyledButton>
        </>
      }
      <Snackbar open={toast} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleClose}
          severity="info"
          variant="filled"
          sx={{ width: '100%' }}>
          You've logged out!.
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AuthNavigation
