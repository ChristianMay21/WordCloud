import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
export async function GET(request: NextRequest) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'word-cloud-submission',
    pagination: false,
  })
  return NextResponse.json(result.docs)
}
