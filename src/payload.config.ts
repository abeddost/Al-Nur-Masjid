import path from "path";
import { fileURLToPath } from "url";

import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Users } from "@/collections/Users";
import { Media } from "@/collections/Media";
import { Pages } from "@/collections/Pages";
import { Announcements } from "@/collections/Announcements";
import { Services } from "@/collections/Services";
import { DonationCampaigns } from "@/collections/DonationCampaigns";
import { News } from "@/collections/News";
import { QuranClasses } from "@/collections/QuranClasses";
import { SiteSettings } from "@/globals/SiteSettings";
import { Navigation } from "@/globals/Navigation";
import { Footer } from "@/globals/Footer";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " — An-Nur Moschee Admin",
    },
  },
  collections: [Users, Media, Pages, Announcements, Services, DonationCampaigns, News, QuranClasses],
  globals: [SiteSettings, Navigation, Footer],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./an-nur.db",
    },
  }),
  sharp,
  localization: {
    locales: ["de", "en", "fa", "ps"],
    defaultLocale: "de",
    fallback: true,
  },
});
