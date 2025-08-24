import { getApiClient } from "./getApiClient.js"
import { defineQuery } from "groq"
import { getInstagramFeed } from "./getInstagramFeed.js"
import { insertPostsToSanity } from "./insertPostsToSanity.js"
import { regenerateToken } from "./regenerateToken.js"

const siteQuery = defineQuery(`
  *[_type == 'site'][0]{
    _id,
    instagramAccessToken
  }
`)

export const main = async () => {
  try {
    /* set up Sanity client */
    const client = getApiClient()

    /* get Instagram access token from Sanity */
    const siteDocument = await client.fetch(siteQuery)
    if (!siteDocument) {
      throw new Error("Error retrieving Site document from Sanity.")
    }
    if (!siteDocument.instagramAccessToken) {
      throw new Error("Missing access token.")
    }
    const INSTAGRAM_LONG_TOKEN = siteDocument.instagramAccessToken

    /* get posts from Instagram */
    const posts = await getInstagramFeed(INSTAGRAM_LONG_TOKEN)

    // insert posts in Sanity */
    const r = await insertPostsToSanity(client, posts)

    /* get new Instagram access token */
    const newToken = await regenerateToken(INSTAGRAM_LONG_TOKEN)

    /* update token in Sanity */
    await client
      .patch(siteDocument._id)
      .set({
        instagramAccessToken: newToken,
      })
      .commit()

    return r
  } catch (error) {
    return { error }
  }
}
