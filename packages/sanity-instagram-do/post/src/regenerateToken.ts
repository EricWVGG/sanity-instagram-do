export const regenerateToken = async (INSTAGRAM_LONG_TOKEN: string) => {
  try {
    /* regenerate token */
    const newTokenData = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${INSTAGRAM_LONG_TOKEN}`)
    if (!newTokenData) {
      throw new Error("Error retrieving data")
    }
    const decoded = await newTokenData.json()
    const newToken: string = decoded.access_token
    return newToken
  } catch (error) {
    return { error }
  }
}
