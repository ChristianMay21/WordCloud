import React from 'react'
import './styles.scss'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" style={{ height: '100%' }}>
      <body style={{ height: '100%' }}>
        <main
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            backgroundColor: 'oklch(0.984 0.003 247.858)'
          }}
        >
          {children}
        </main>
      </body>
    </html>
  )
}
