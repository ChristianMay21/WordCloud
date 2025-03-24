'use client'

import React, { useEffect, useState } from 'react'
import { Text } from '@visx/text'
import { scaleLog } from '@visx/scale'
import Wordcloud from '@visx/wordcloud/lib/Wordcloud'
import { type WordCloudSubmission } from '@/payload-types'

interface WordData {
  text: string
  value: number
}

interface WordCloudProps {
  width?: number
  height?: number
  maxWords?: number
  submissions?: WordCloudSubmission[]
  show?: boolean
}

const colors = ['#2f0d68', '#0f172b', '#432004']

const WordCloud: React.FC<WordCloudProps> = ({
  width = 300,
  height = 250,
  maxWords = 100,
  show = false,
}) => {
  const [words, setWords] = useState<WordData[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/getSubmissions')
        const submissions: WordCloudSubmission[] = await response.json()

        // Process submissions into word frequency map
        const wordMap: Record<string, number> = {}
        submissions.forEach((submission) => {
          if (submission.Submission) {
            const words = submission.Submission.toLowerCase()
              .split(/\s+/)
              .filter((word) => word.length > 2) // Filter out short words

            words.forEach((word) => {
              // Remove punctuation
              const cleanWord = word.replace(/[^\w\s]|_/g, '')
              if (cleanWord) {
                wordMap[cleanWord] = (wordMap[cleanWord] || 0) + 1
              }
            })
          }
        })

        // Convert to array format needed for wordcloud
        const wordData: WordData[] = Object.entries(wordMap)
          .map(([text, value]) => ({ text, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, maxWords)

        function arraysEqual(a: WordData[], b: WordData[]) {
          if (a === b) return true
          if (a == null || b == null) return false
          if (a.length !== b.length) return false

          // If you don't care about the order of the elements inside
          // the array, you should sort both arrays here.
          // Please note that calling sort on an array will modify that array.
          // you might want to clone your array first.

          for (let i = 0; i < a.length; ++i) {
            if (a[i].text !== b[i].text) return false
          }
          return true
        }

        if (!arraysEqual(wordData, words)) {
          setWords(wordData)
        }
      } catch (error) {
        console.error('Error fetching word cloud data:', error)
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchSubmissions()

    // Set up interval to fetch every 15 seconds
    const intervalId = setInterval(() => {
      fetchSubmissions()
    }, 60000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [maxWords])

  const fontScale = scaleLog({
    domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))].map(
      (d) => Math.max(1, d),
    ),
    range: [10, 60],
  })

  const fontSizeSetter = (datum: WordData) => fontScale(datum.value)

  const hasSubmittedCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('HasAlreadySubmitted='))

  if (!show && !hasSubmittedCookie) return <></>
  return (
    <>
      <h1
        style={{
          textAlign: 'center',
          color: 'oklch(0.257 0.09 281.288)',
          marginBottom: '16px',
          fontSize: '28px',
        }}
      >
        What others said:
      </h1>
      <div
        className="word-cloud-container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'oklch(0.97 0.001 106.424)',
          borderRadius: '1rem',
          boxShadow: '0 3px 4px rgba(0, 0, 0, 0.1)',
          border: '1px solid oklch(0.869 0.022 252.894)',
        }}
      >
        {loading ? (
          <div></div>
        ) : words.length === 0 ? (
          <div>No data available for word cloud</div>
        ) : (
          <Wordcloud
            words={words}
            width={width}
            height={height}
            fontSize={fontSizeSetter}
            font={'Impact'}
            padding={2}
            spiral="rectangular"
            rotate={0}
          >
            {(cloudWords) =>
              cloudWords.map((w, i) => (
                <Text
                  key={`${w.text}-${i}`}
                  fill={colors[i % colors.length]}
                  textAnchor={'middle'}
                  transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                  fontSize={w.size}
                  fontFamily={w.font}
                >
                  {w.text}
                </Text>
              ))
            }
          </Wordcloud>
        )}
      </div>
    </>
  )
}

export default WordCloud
