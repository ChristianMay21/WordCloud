'use client'

import React, { useState } from 'react'
import WordCloud from '@/app/components/WordCloud'
import Submit from '@/app/components/Submit'

export default function CloudPage() {
  // Add a state variable that will change to trigger re-renders
  const [refreshKey, setRefreshKey] = useState(0)
  const [showWordCloud, setShowWordCloud] = useState(false)

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
      }}
    >
      <WordCloud key={refreshKey} show={showWordCloud} />
      <Submit onSubmit={refreshWordCloud} />
    </div>
  )
}
