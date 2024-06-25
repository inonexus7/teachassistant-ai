import React, { FC } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import { StyledButton } from '@/components/styled-button'

const AuthNavigation: FC = () => {
  return (
    <Box sx={{ '& button:first-of-type': { mr: 2 } }}>
      <Link href={`/signin`}>
        <StyledButton disableHoverEffect={true} variant="outlined">
          Sign In
        </StyledButton>
      </Link>
      <Link href={`/signup`}>
        <StyledButton disableHoverEffect={true}>Sign Up</StyledButton>
      </Link>
    </Box>
  )
}

export default AuthNavigation
