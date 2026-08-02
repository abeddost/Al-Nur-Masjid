import type { CollectionConfig } from "payload";
import { isSuperAdminOr } from "@/access/roles";

export const QuranClasses: CollectionConfig = {
  slug: "quran-classes",
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "season", "dayOfWeek", "startTime", "endTime", "audience"],
    description:
      "The single source of truth for Quran-school and Tafsir schedule times shown across the site. Edit here once, not per-page.",
  },
  access: {
    create: isSuperAdminOr("events-editor"),
    delete: isSuperAdminOr("events-editor"),
    read: () => true,
    update: isSuperAdminOr("events-editor"),
  },
  fields: [
    {
      name: "label",
      type: "text",
      required: true,
      localized: true,
      admin: { description: 'e.g. "Koranschule (Winter)" or "Tafsir"' },
    },
    {
      name: "type",
      type: "select",
      required: true,
      options: [
        { label: "Koranschule", value: "koranschule" },
        { label: "Tafsir", value: "tafsir" },
      ],
    },
    {
      name: "season",
      type: "select",
      options: [
        { label: "Winter", value: "winter" },
        { label: "Summer", value: "summer" },
        { label: "Year-round", value: "year-round" },
      ],
    },
    {
      name: "dayOfWeek",
      type: "select",
      hasMany: true,
      required: true,
      options: [
        { label: "Monday", value: "mon" },
        { label: "Tuesday", value: "tue" },
        { label: "Wednesday", value: "wed" },
        { label: "Thursday", value: "thu" },
        { label: "Friday", value: "fri" },
        { label: "Saturday", value: "sat" },
        { label: "Sunday", value: "sun" },
      ],
    },
    {
      name: "startTime",
      type: "text",
      admin: { description: '24h "HH:mm", e.g. "11:00". Leave blank for "after Isha" style timing.' },
    },
    {
      name: "endTime",
      type: "text",
      admin: { description: '24h "HH:mm", e.g. "13:00".' },
    },
    {
      name: "relativeTiming",
      type: "text",
      localized: true,
      admin: { description: 'For times not on the clock, e.g. "nach dem Ischagebet" / "after Isha prayer".' },
    },
    {
      name: "audience",
      type: "select",
      hasMany: true,
      options: [
        { label: "Children", value: "children" },
        { label: "Youth", value: "youth" },
        { label: "Adults", value: "adults" },
      ],
    },
    { name: "order", type: "number", defaultValue: 0 },
  ],
};
