import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Instructions | Eval',
  description: 'View and edit the instruction file for evaluations.',

  openGraph: {
    title: 'Instructions | Eval',
    description: 'View and edit the instruction file for evaluations.',
    siteName: 'Eval',
    images: [
      {
        url: '/huangshan.png',
        width: 1200,
        height: 630,
        alt: 'View and edit the instruction file for evaluations.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Instructions | Eval',
    description: 'View and edit the instruction file for evaluations.',
    images: ['/huangshan.png'],
    creator: '@julienbrg',
  },
}

export default function InstructionFileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
