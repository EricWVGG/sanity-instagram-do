import { type InstagramPost } from "./convertDataToInstagramPost.js"

export const insertPostsToSanity = async (client: any, posts: Array<InstagramPost>) => {
  try {
    const transaction = client.transaction()
    await Promise.all(
      posts.map(async (post) => {
        const imageBuffer = await fetch(post.mediaUrl!)
          .then((response) => response.blob())
          .then((blob) => blob.arrayBuffer())
          .then((arrayBuffer) => Buffer.from(arrayBuffer))

        const uploadedImage = await client.assets.upload("image", imageBuffer)

        post.media = {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: uploadedImage._id,
          },
        }

        return Promise.resolve(transaction.createOrReplace(post))
      })
    )
    return await transaction.commit()
  } catch (error) {
    return JSON.stringify(error)
  }
}
