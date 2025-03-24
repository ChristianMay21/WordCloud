import type { CollectionConfig } from 'payload'

export const WordCloudSubmission: CollectionConfig = {
  slug: 'word-cloud-submission',
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'Submission',
      type: 'text',
    },
  ],
}
