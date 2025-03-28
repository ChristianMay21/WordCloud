import React from 'react'
import './styles.scss'

export const metadata = {
  description: 'Word Cloud Submission Form',
  title: 'Word Cloud',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" style={{ height: '100%' }}>
      <body style={{ height: '100%', marginBlock: '0', marginInline: '0' }}>
        <main
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            backgroundColor: 'oklch(0.929 0.013 255.508)',
            paddingInline: '24px',
          }}
        >
          {children}
        </main>
      </body>
    </html>
  )
}
