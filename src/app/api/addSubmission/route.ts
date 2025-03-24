import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    const { submission } = body

    // Validate the submission
    if (!submission || typeof submission !== 'string') {
      return NextResponse.json(
        { error: 'Invalid submission. Please provide valid text.' },
        { status: 400 },
      )
    }

    // Check for inappropriate content using Anthropic Claude API
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

    if (!ANTHROPIC_API_KEY) {
      console.warn('ANTHROPIC_API_KEY not found in environment variables')
    } else {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-7-sonnet-20250219',
            max_tokens: 1024,
            messages: [
              {
                role: 'user',
                content: `The following text is a submission to a word cloud about a specific piece of artwork depicting a young black woman wearing a medical mask. Please analyze if the following text contains inappropriate, offensive, or harmful content. Please provide a single-word response - "YES" or "NO". Only respond with "NO" if the word is either generally offensive or if there is a significant chance that the word may be disrespectful to the subect of the artwork - particularly if it is racist, discriminatory, or generally inapproriate. Say "YES" if it's appropriate.
                Text: "${submission}"`,
              },
            ],
          }),
        })

        const result = await response.json()

        if (result.content && result.content[0].text.includes('NO')) {
          return NextResponse.json(
            {
              error:
                'Submission has been flagged as potentially containing offensive content, and was not submitted. We apologize if this was in error.',
            },
            { status: 400 },
          )
        }
      } catch (error) {
        console.error('Error checking content with Claude API:', error)
        // Continue with submission even if content check fails
      }
    }

    // Validate that the submission is a single word
    const words = submission.trim().split(/\s+/)
    if (words.length !== 1) {
      return NextResponse.json({ error: 'Submission must be a single word only.' }, { status: 400 })
    }

    // Initialize Payload
    const payload = await getPayload({ config })

    // Create a new submission in the collection
    const result = await payload.create({
      collection: 'word-cloud-submission',
      data: {
        Submission: submission,
      },
    })

    return NextResponse.json(
      { success: true, message: 'Submission added successfully', data: result },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error adding submission:', error)
    return NextResponse.json(
      {
        error: 'Failed to add submission',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
