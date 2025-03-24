'use client'

import React from 'react'
import WordCloud from '@/app/components/WordCloud'
import Submit from '@/app/components/Submit'

export default function CloudPage() {
  return (
    <div style={{ backgroundColor: '', fontFamily: 'sans-serif', marginTop: 'auto', marginBottom: 'auto' }}>
      <WordCloud />
      <Submit />
    </div>
  )
}
