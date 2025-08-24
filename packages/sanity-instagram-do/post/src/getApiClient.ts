// returns a SanityClient with WRITE privileges

import { createClient } from "@sanity/client"

export const getApiClient = () => {
  const SANITY_SECRET_TOKEN = process.env.SANITY_SECRET_TOKEN
  const apiVersion = process.env.SANITY_API_VERSION
  const dataset = process.env.SANITY_DATASET
  const projectId = process.env.SANITY_PROJECT_ID
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token: SANITY_SECRET_TOKEN,
    useCdn: false,
  })
}
