import React from 'react'
import './styles.scss'

export const metadata = {
  description: 'Word Cloud Submission Form',
  title: 'WWord Cloud',
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
            backgroundColor: 'oklch(0.984 0.003 247.858)',
          }}
        >
          {children}
        </main>
      </body>
    </html>
  )
}
