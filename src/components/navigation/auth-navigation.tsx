import React, { FC } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import { StyledButton } from '@/components/styled-button'
import { useAuthContext } from '@/contexts/auth-context'

const AuthNavigation: FC = () => {
  const auth = useAuthContext();

  if (!auth) {
    throw new Error("Invalid context")
  }

  const { isAuthenticated, user, signOut } = auth;

  const handleSignOut = () => {
    try {
      signOut();
    } catch (err) {
      console.log("Error");
    }
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

    </Box>
  )
}

export default AuthNavigation
