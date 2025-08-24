import { convertDataToInstagramPost, type InstagramData } from "./convertDataToInstagramPost.js"

export const getInstagramFeed = async (access_token: string) => {
  const url = new URL(`https://graph.instagram.com/me/media`)
  url.searchParams.set("fields", ["id", "caption", "media_type", "media_url", "permalink", "thumbnail_url", "timestamp"].join(","))
  url.searchParams.set("access_token", access_token)
  const response = await fetch(url)
  const data: { data: Array<InstagramData> } = await response.json()
  const posts = data.data.map((post) => convertDataToInstagramPost(post))
  return posts
}
