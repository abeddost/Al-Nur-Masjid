import type { GlobalConfig } from "payload";
import { isSuperAdmin } from "@/access/roles";

export const Footer: GlobalConfig = {
  slug: "footer",
  access: {
    read: () => true,
    update: isSuperAdmin,
  },
  fields: [
    { name: "shortDescription", type: "textarea", localized: true },
    {
      name: "socialLinks",
      type: "array",
      fields: [
        {
          name: "platform",
          type: "select",
          options: ["facebook", "instagram", "youtube", "whatsapp"],
        },
        { name: "url", type: "text", required: true },
      ],
    },
    {
      name: "newsletterEnabled",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Enable once a privacy-compliant newsletter/subscription tool is chosen." },
    },
  ],
};
