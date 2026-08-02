import type { CollectionConfig } from "payload";
import { isSuperAdmin, isSuperAdminFieldLevel } from "@/access/roles";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role"],
    description:
      "Admin accounts for the An-Nur website. Assign the narrowest role that lets each person do their job.",
  },
  access: {
    create: isSuperAdmin,
    delete: isSuperAdmin,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "superadmin") return true;
      return { id: { equals: user.id } };
    },
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "content-editor",
      access: {
        update: isSuperAdminFieldLevel,
      },
      options: [
        { label: "Super Administrator", value: "superadmin" },
        { label: "Content Editor", value: "content-editor" },
        { label: "Events Editor", value: "events-editor" },
        { label: "Donation & Project Editor", value: "donation-editor" },
        { label: "Translator", value: "translator" },
      ],
      admin: {
        description:
          "Super Administrator: full access. Content Editor: pages, news, services, media. Events Editor: events, announcements, Quran-class schedule. Donation & Project Editor: donation campaigns and social projects (not bank details). Translator: non-German copy only, cannot publish.",
      },
    },
  ],
};
