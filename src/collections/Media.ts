import type { CollectionConfig } from "payload";
import { anyoneLoggedIn } from "@/access/roles";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "filename",
    defaultColumns: ["filename", "kind", "isPlaceholder"],
    description:
      "Real photos and the mosque logo live here once supplied. Until then, use a Placeholder entry so the site clearly shows an empty slot instead of inventing an image.",
  },
  access: {
    create: anyoneLoggedIn,
    delete: anyoneLoggedIn,
    read: () => true,
    update: anyoneLoggedIn,
  },
  upload: {
    staticDir: "media",
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 800, height: 600, position: "centre" },
      { name: "hero", width: 1920, height: 1080, position: "centre" },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description: "Describe the image for screen readers. Required even for placeholders.",
      },
    },
    {
      name: "kind",
      type: "select",
      defaultValue: "generic",
      options: [
        { label: "Logo", value: "logo" },
        { label: "Exterior", value: "exterior" },
        { label: "Interior", value: "interior" },
        { label: "Event", value: "event" },
        { label: "Team", value: "team" },
        { label: "Generic", value: "generic" },
      ],
    },
    {
      name: "isPlaceholder",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "Check this for any slot that does not yet have a real photo. The frontend renders a clearly labeled placeholder box instead of this file.",
      },
    },
    {
      name: "placeholderLabel",
      type: "text",
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.isPlaceholder),
        description: 'e.g. "ADD MOSQUE LOGO" or "ADD GALLERY PHOTO — EXTERIOR"',
      },
    },
  ],
};
