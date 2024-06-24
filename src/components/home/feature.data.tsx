import React, { ReactNode } from 'react'
import ArtTrackIcon from '@mui/icons-material/ArtTrack'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary'
import ContactSupportIcon from '@mui/icons-material/ContactSupport'

interface Data {
  title: string
  description: string
  icon?: ReactNode
}

export const data: Data[] = [
  {
    title: 'Easy Accessable',
    description: 'You can access support 24/7 whenever you have questions',
    icon: <ArtTrackIcon />,
  },
  {
    title: 'More Affordable Cost',
    description: 'You will be pleasantly surprised by the affordable cost of the AI chatbot tutor',
    icon: <AttachMoneyIcon />,
  },
  {
    title: 'Flexible Study Time',
    description: 'Using an AI chatbot tutor has been the flexibility it provides for my study time.',
    icon: <LocalLibraryIcon />,
  },
  {
    title: 'Consultation With Mentor',
    description: 'Ability to consult with experienced mentors on my professional development.',
    icon: <ContactSupportIcon />,
  },
]
