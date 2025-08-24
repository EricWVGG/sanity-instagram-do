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
    /* set up Sanity */
    const client = getApiClient()

    /* get token from Sanity */
    const siteSettings = await client.fetch(siteQuery)
    if (!siteSettings) {
      throw new Error("Error retrieving site settings from Sanity.")
    }
    if (!siteSettings.instagramAccessToken) {
      throw new Error("Missing access token.")
    }
    const INSTAGRAM_LONG_TOKEN = siteSettings.instagramAccessToken
    const siteSettingsId = siteSettings._id

    const posts = await getInstagramFeed(INSTAGRAM_LONG_TOKEN)

    const r = await insertPostsToSanity(client, posts)

    const newToken = await regenerateToken(INSTAGRAM_LONG_TOKEN)

    /* update token in Sanity */
    await client
      .patch(siteSettingsId)
      .set({
        instagramAccessToken: newToken,
      })
      .commit()

    return r
  } catch (error) {
    return { error }
  }
}
