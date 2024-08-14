import React, { FC } from 'react'
import { Box, Typography } from '@mui/material'
import Link from 'next/link'

interface Props {
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

const Logo: FC<Props> = ({ onClick, variant }) => {
  return (
    <Box onClick={onClick}>
      <Link href={`/`} passHref={true}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 700, '& span': { color: variant === 'primary' ? 'primary.main' : 'unset' }, cursor: 'pointer' }}
        >
          Teach<span>Assist</span>
        </Typography>
      </Link>
    </Box>
  )
}

Logo.defaultProps = {
  variant: 'primary',
}

export default Logo
