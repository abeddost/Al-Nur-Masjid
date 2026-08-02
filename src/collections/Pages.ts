import type { CollectionConfig } from "payload";
import { isSuperAdminOr } from "@/access/roles";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status"],
  },
  access: {
    create: isSuperAdminOr("content-editor"),
    delete: isSuperAdminOr("content-editor"),
    read: ({ req: { user } }) => {
      if (user) return true;
      return { _status: { equals: "published" } };
    },
    update: isSuperAdminOr("content-editor"),
  },
  versions: {
    drafts: {
      autosave: { interval: 1000 },
    },
    maxPerDoc: 25,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "URL path segment, same across all four languages, e.g. \"unsere-moschee\"." },
    },
    {
      name: "blocks",
      type: "blocks",
      minRows: 1,
      blocks: [
        {
          slug: "hero",
          labels: { singular: "Hero", plural: "Heroes" },
          fields: [
            { name: "heading", type: "text", required: true, localized: true },
            { name: "subheading", type: "text", localized: true },
            { name: "image", type: "upload", relationTo: "media" },
          ],
        },
        {
          slug: "richText",
          labels: { singular: "Rich Text", plural: "Rich Text" },
          fields: [{ name: "content", type: "richText", localized: true }],
        },
        {
          slug: "cta",
          labels: { singular: "Call to Action", plural: "Calls to Action" },
          fields: [
            { name: "heading", type: "text", localized: true },
            { name: "buttonLabel", type: "text", required: true, localized: true },
            { name: "buttonHref", type: "text", required: true },
          ],
        },
        {
          slug: "faq",
          labels: { singular: "FAQ Section", plural: "FAQ Sections" },
          fields: [
            {
              name: "items",
              type: "array",
              fields: [
                { name: "question", type: "text", required: true, localized: true },
                { name: "answer", type: "richText", required: true, localized: true },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "collapsible",
      label: "SEO",
      fields: [
        { name: "metaTitle", type: "text", localized: true },
        { name: "metaDescription", type: "textarea", localized: true },
        { name: "ogImage", type: "upload", relationTo: "media" },
      ],
    },
  ],
};
