import type { CollectionConfig } from "payload";
import { isSuperAdminOr } from "@/access/roles";

export const News: CollectionConfig = {
  slug: "news",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "publishedAt", "_status"],
  },
  access: {
    create: isSuperAdminOr("content-editor", "events-editor"),
    delete: isSuperAdminOr("content-editor", "events-editor"),
    read: ({ req: { user } }) => {
      if (user) return true;
      return { _status: { equals: "published" } };
    },
    update: isSuperAdminOr("content-editor", "events-editor"),
  },
  versions: { drafts: true },
  fields: [
    { name: "title", type: "text", required: true, localized: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "excerpt", type: "textarea", localized: true },
    { name: "body", type: "richText", required: true, localized: true },
    { name: "coverImage", type: "upload", relationTo: "media" },
    {
      name: "category",
      type: "select",
      options: [
        { label: "Announcement", value: "announcement" },
        { label: "Community Update", value: "community" },
        { label: "Educational Article", value: "educational" },
        { label: "Project Report", value: "project-report" },
      ],
    },
    { name: "publishedAt", type: "date", defaultValue: () => new Date().toISOString() },
  ],
};
