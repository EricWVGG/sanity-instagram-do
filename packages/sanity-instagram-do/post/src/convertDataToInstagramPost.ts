export interface InstagramData {
  id: string
  caption: string
  media_type: "IMAGE"
  media_url: string
  permalink: string
  timestamp: string
}

export type InstagramPost = {
  _id: string
  _type: "instagramPost"
  _createdAt: string
  _updatedAt: string
  _rev: string
  media?: {
    asset?: {
      _ref: string
      _type: "reference"
      _weak?: boolean
      // [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    }
    media?: unknown
    // hotspot?: SanityImageHotspot;
    // crop?: SanityImageCrop;
    _type: "image"
  }
  mediaUrl: string
  caption: string
  mediaType: string
  permalink: string
  timestamp: string
  instagramId: string
}

export const convertDataToInstagramPost = ({ id, caption, media_type, media_url, permalink, timestamp }: InstagramData): InstagramPost => {
  const now = new Date()
  const created = new Date(timestamp)
  return {
    _id: `instagram-${id}`,
    _rev: "0",
    _type: "instagramPost",
    _createdAt: created.toISOString(),
    _updatedAt: now.toISOString(),
    instagramId: id,
    caption,
    mediaType: media_type,
    mediaUrl: media_url, // todo: retrieve attachment
    permalink,
    timestamp,
  }
}
