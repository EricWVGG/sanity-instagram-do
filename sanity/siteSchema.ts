import { defineField, defineType } from "sanity"

export const site = defineType({
  name: "site",
  type: "document",
  title: "Site",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "navigation", title: "Navigation" },
    { name: "content", title: "Content" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "general",
    }),

    defineField({
      name: "ogDescription",
      type: "text",
      rows: 2,
      validation: (rule) => rule.max(255),
    }),

    defineField({
      name: "ogImage",
      type: "image",
      title: "Open Graph Image (global)",
      description: "Used for social sharing previews",
      group: "general",
    }),

    defineField({
      name: "instagramAccessToken",
      type: "string",
      // hidden: true,
      // readOnly: true,
    }),
  ],
})
