import type { GlobalConfig } from "payload";
import { isSuperAdmin } from "@/access/roles";

export const Navigation: GlobalConfig = {
  slug: "navigation",
  access: {
    read: () => true,
    update: isSuperAdmin,
  },
  fields: [
    {
      name: "items",
      type: "array",
      labels: { singular: "Menu Item", plural: "Menu Items" },
      fields: [
        { name: "label", type: "text", required: true, localized: true },
        { name: "href", type: "text", required: true },
      ],
      defaultValue: [
        { label: "Home", href: "/" },
        { label: "Mosque", href: "/unsere-moschee" },
        { label: "Quran School", href: "/koranschule" },
        { label: "Community", href: "/unser-verein" },
        { label: "News and Events", href: "/aktuelles" },
        { label: "Services", href: "/beratung-und-dienstleistung" },
        { label: "Donations", href: "/spenden" },
        { label: "About Us", href: "/unser-verein" },
        { label: "Contact", href: "/kontakt" },
      ],
    },
  ],
};
