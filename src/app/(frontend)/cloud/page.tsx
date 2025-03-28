'use client'

import React, { useState, useEffect } from 'react'
import WordCloud from '@/app/components/WordCloud'
import Submit from '@/app/components/Submit'
import Image from 'next/image'
export default function CloudPage() {
  // Add a state variable that will change to trigger re-renders
  const [refreshKey, setRefreshKey] = useState(0)
  const [showWordCloud, setShowWordCloud] = useState(false)

  useEffect(() => {
    // Check if user has already submitted
    const hasSubmittedCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('HasAlreadySubmitted='))

    if (hasSubmittedCookie) {
      setShowWordCloud(true)
    }
  }, [])

  // Function to force re-render of WordCloud
  const refreshWordCloud = () => {
    // Incrementing the state will cause a re-render
    setRefreshKey((prevKey: number) => prevKey + 1)
    setShowWordCloud(true)
  }

  return (
    <div
      style={{
        backgroundColor: '',
        fontFamily: 'sans-serif',
        marginTop: 'auto',
        marginBottom: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Image
        src="/art.webp"
        width={250}
        height={329}
        alt="A young Black woman with shoulder-length braids wearing a medical mask. She stares straight at you with a neutral expression."
        style={{ borderRadius: '16px', marginBottom: '16px' }}
      />
      {showWordCloud && <WordCloud key={refreshKey} />}
      {!showWordCloud && <Submit onSubmit={refreshWordCloud} />}
    </div>
  )
}
