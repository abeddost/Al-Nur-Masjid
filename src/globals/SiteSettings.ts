import type { GlobalConfig } from "payload";
import { isSuperAdmin, isSuperAdminFieldLevel } from "@/access/roles";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: {
    description:
      "Core legal & contact identity of the association. Several fields below are flagged as unverified because the current live site shows conflicting information — resolve and mark verified before removing the warning banners on the frontend.",
  },
  access: {
    read: () => true,
    update: isSuperAdmin,
  },
  fields: [
    {
      type: "collapsible",
      label: "Legal Identity",
      fields: [
        {
          name: "legalName",
          type: "text",
          required: true,
          defaultValue: "Afghanisch Islamischer Kulturverein Wiesbaden und Umgebung e.V.",
        },
        {
          name: "legalNameDiscrepancyNote",
          type: "textarea",
          admin: {
            readOnly: true,
            description:
              "Internal note: the 2013 Satzung itself uses \"Afghanischer Kulturverein Wiesbaden und Umgebung\" (without \"Islamischer\" / \"e.V.\"). Confirm the currently correct legal name before publishing.",
          },
          defaultValue:
            "[VERIFY LEGAL NAME] Satzung (2013) reads \"Afghanischer Kulturverein Wiesbaden und Umgebung\"; Impressum reads \"Afghanisch Islamischer Kulturverein Wiesbaden und Umgebung e.V.\"",
        },
        { name: "foundingYear", type: "number", defaultValue: 2007 },
        { name: "vereinsregisterNumber", type: "text", defaultValue: "VR 6123" },
        { name: "registerCourt", type: "text", defaultValue: "Amtsgericht Wiesbaden" },
        {
          name: "representedBy",
          type: "array",
          fields: [{ name: "name", type: "text", required: true }],
          defaultValue: [{ name: "Mohammad Zahir Sarwari" }, { name: "Akram Nawabi" }],
        },
        {
          name: "rolesVerified",
          type: "checkbox",
          defaultValue: false,
          admin: {
            description: "Check once each board member's official title/role has been confirmed for publication.",
          },
        },
      ],
    },
    {
      type: "collapsible",
      label: "Contact",
      fields: [
        { name: "email", type: "email", defaultValue: "info@afgkv.de" },
        { name: "address", type: "text", defaultValue: "Erich-Ollenhauer Straße 4, 65187 Wiesbaden" },
        {
          name: "phoneNumbers",
          type: "array",
          admin: {
            description:
              "The legacy site shows different numbers on different pages. All are kept here, labeled, until the mosque confirms which should appear where.",
          },
          fields: [
            { name: "number", type: "text", required: true },
            { name: "label", type: "text", required: true, localized: true },
          ],
          defaultValue: [
            { number: "0176 21626665", label: "General (from Impressum)" },
            { number: "+49 163 9517548", label: "Dari/Afghan line — counseling, helpline, marriages" },
            { number: "+49 176 30501624", label: "German line — administration & general inquiries" },
          ],
        },
        {
          name: "phoneNumbersVerified",
          type: "checkbox",
          defaultValue: false,
          access: { update: isSuperAdminFieldLevel },
          admin: { description: "Check once the mosque confirms which number(s) should be published where." },
        },
      ],
    },
    {
      type: "collapsible",
      label: "Prayer Times (Mawaqit)",
      fields: [
        {
          name: "mawaqitSlug",
          type: "text",
          required: true,
          defaultValue: "afghanisch-islamischer-kulturverein-wiesbaden-65197-germany",
          admin: {
            description: "The mosque's Mawaqit profile slug. Prayer times are never entered manually elsewhere.",
          },
        },
      ],
    },
  ],
};
