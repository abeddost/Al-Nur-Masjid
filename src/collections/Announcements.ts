import type { CollectionConfig } from "payload";
import { isSuperAdminOr } from "@/access/roles";

export const Announcements: CollectionConfig = {
  slug: "announcements",
  admin: {
    useAsTitle: "message",
    defaultColumns: ["message", "priority", "variant", "startDate", "endDate", "isActive"],
    description:
      "Shown in the homepage announcement card and the header announcement bar. Use for Jumu'ah changes, Eid/Ramadan schedules, funeral notices, closures, or urgent fundraising.",
  },
  access: {
    create: isSuperAdminOr("events-editor"),
    delete: isSuperAdminOr("events-editor"),
    read: () => true,
    update: isSuperAdminOr("events-editor"),
  },
  fields: [
    {
      name: "message",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "link",
      type: "text",
      admin: { description: "Optional URL for a \"read more\" link." },
    },
    {
      name: "variant",
      type: "select",
      required: true,
      defaultValue: "info",
      options: [
        { label: "Info", value: "info" },
        { label: "Warning", value: "warning" },
        { label: "Urgent", value: "urgent" },
      ],
    },
    {
      name: "priority",
      type: "number",
      defaultValue: 0,
      admin: { description: "Higher numbers show first when multiple announcements are active." },
    },
    {
      name: "startDate",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: "endDate",
      type: "date",
      admin: { description: "The announcement automatically stops showing after this date." },
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
    },
  ],
};
