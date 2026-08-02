import type { CollectionConfig } from "payload";
import { isSuperAdminOr } from "@/access/roles";

export const DonationCampaigns: CollectionConfig = {
  slug: "donation-campaigns",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "isActive", "goalAmountCents", "raisedAmountCents"],
    description:
      "Only enter goal/raised amounts once the mosque has confirmed real, verified figures. Leave both blank to show a clearly-labeled pending state instead of a fabricated number.",
  },
  access: {
    create: isSuperAdminOr("donation-editor"),
    delete: isSuperAdminOr("donation-editor"),
    read: () => true,
    update: isSuperAdminOr("donation-editor"),
  },
  fields: [
    { name: "name", type: "text", required: true, localized: true },
    { name: "description", type: "richText", required: true, localized: true },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Mosque Renovation", value: "renovation" },
        { label: "General Mosque Expenses", value: "general" },
        { label: "Quran Education", value: "education" },
        { label: "Social Assistance", value: "social" },
        { label: "Humanitarian Projects", value: "humanitarian" },
        { label: "Zakat", value: "zakat" },
        { label: "Sadaqah", value: "sadaqah" },
      ],
    },
    {
      name: "goalAmountCents",
      type: "number",
      admin: {
        description: "Verified funding target in cents. Leave empty if not yet confirmed — do not estimate.",
      },
    },
    {
      name: "raisedAmountCents",
      type: "number",
      admin: {
        description: "Verified amount received in cents. Leave empty if not yet confirmed — do not estimate.",
      },
    },
    { name: "latestUpdate", type: "richText", localized: true },
    { name: "isActive", type: "checkbox", defaultValue: true },
    { name: "coverImage", type: "upload", relationTo: "media" },
  ],
};
