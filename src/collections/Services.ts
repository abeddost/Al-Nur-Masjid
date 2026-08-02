import type { CollectionConfig } from "payload";
import { isSuperAdminOr } from "@/access/roles";

export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category"],
  },
  access: {
    create: isSuperAdminOr("content-editor"),
    delete: isSuperAdminOr("content-editor"),
    read: () => true,
    update: isSuperAdminOr("content-editor"),
  },
  fields: [
    { name: "title", type: "text", required: true, localized: true },
    { name: "description", type: "textarea", required: true, localized: true },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Daily Prayers", value: "prayers" },
        { label: "Quran School", value: "quran-school" },
        { label: "Islamic Education", value: "education" },
        { label: "Social Assistance", value: "social-assistance" },
        { label: "Advice & Counselling", value: "counselling" },
        { label: "Islamic Marriage", value: "marriage" },
        { label: "Funeral Assistance", value: "funeral" },
        { label: "Community Events", value: "events" },
      ],
    },
    {
      name: "icon",
      type: "text",
      admin: { description: "Lucide icon name, e.g. \"heart-handshake\"." },
    },
    {
      name: "linkHref",
      type: "text",
      admin: { description: "Path this service card links to, e.g. \"/koranschule\"." },
    },
    { name: "order", type: "number", defaultValue: 0 },
  ],
};
