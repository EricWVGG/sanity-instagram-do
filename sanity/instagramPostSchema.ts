import { defineField, defineType } from "sanity"

export const instagramPost = defineType({
  name: "instagramPost",
  type: "document",

  preview: {
    select: {
      title: "caption",
      subtitle: "timestamp",
      media: "media",
    },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: new Date(subtitle).toLocaleString(),
      media,
    }),
  },

  fields: [
    defineField({
      name: "media",
      type: "image",
    }),
    defineField({
      name: "mediaUrl",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mediaType",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "permalink",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "timestamp",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "instagramId",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
})
