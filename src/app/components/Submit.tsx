'use client'

import React, { useState } from 'react'

const Submit: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
  const [submission, setSubmission] = useState('')
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'idle'
    message: string
  }>({ type: 'idle', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Check if user has already submitted
    const hasSubmittedCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('HasAlreadySubmitted='))

    if (hasSubmittedCookie) {
      setStatus({
        type: 'error',
        message: 'You have already submitted a word. Thank you for your participation!',
      })
      return
    }
    if (!submission.trim()) {
      setStatus({
        type: 'error',
        message: 'Please enter some text before submitting.',
      })
      return
    }

    try {
      setIsSubmitting(true)
      setStatus({ type: 'idle', message: '' })

      const response = await fetch('/api/addSubmission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submission }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Thank you for your submission!',
        })
        // Set cookie to prevent duplicate submissions
        document.cookie = 'HasAlreadySubmitted=true; path=/'
        setSubmission('') // Clear the input field
        onSubmit()
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Failed to submit. Please try again.',
        })
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.',
      })
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="submission-container">
      <p>
        In one word, what would you title this piece? Or, feel free to submit a one word response to
        this piece.
      </p>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'space-between',
            marginTop: '10px',
          }}
        >
          <input
            type="text"
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
            placeholder="Enter your word here..."
            disabled={isSubmitting}
            className="submission-textarea"
          />

          <button type="submit" disabled={isSubmitting} className="submission-button">
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>

      {status.message && <div className={`submission-status ${status.type}`}>{status.message}</div>}

      <style jsx>{`
        .submission-container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 3px 4px rgba(0, 0, 0, 0.1);
          border: 1px solid #eee;
        }

        .submission-textarea {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
          font-size: 1rem;
          width: calc(100% - 110px);
          margin-right: 10px;
        }

        .submission-button {
          padding: 0.75rem 1.5rem;
          background-color: rgb(24, 24, 27);
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
          width: 100px;
          font-weight: 500;
        }

        .submission-button:hover {
          background-color: #1f1f1f;
        }

        .submission-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }

        .submission-status {
          margin-top: 1rem;
          padding: 0.75rem;
          border-radius: 4px;
          font-weight: 500;
        }

        .success {
          background-color: #e6f7e6;
          color: #2e7d32;
        }

        .error {
          background-color: #fdeded;
          color: #d32f2f;
        }
      `}</style>
    </div>
  )
}

export default Submit
