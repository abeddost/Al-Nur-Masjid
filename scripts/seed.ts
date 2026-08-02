/**
 * Idempotent seed script: creates the first superadmin (if none exists) and
 * loads only verified real content scraped from the current afgkv.de site.
 * Run with: npm run seed
 */
import { getPayload } from "payload";
import config from "@/payload.config";
import de from "@/messages/de.json" with { type: "json" };
import en from "@/messages/en.json" with { type: "json" };
import fa from "@/messages/fa.json" with { type: "json" };
import ps from "@/messages/ps.json" with { type: "json" };

const messagesByLocale = { de, en, fa, ps } as const;
const locales = Object.keys(messagesByLocale) as (keyof typeof messagesByLocale)[];

async function main() {
  const payload = await getPayload({ config });

  // --- First superadmin user ---
  const existingUsers = await payload.find({ collection: "users", limit: 1 });
  if (existingUsers.totalDocs === 0) {
    const email = process.env.SEED_ADMIN_EMAIL || "admin@afgkv.de";
    const password = process.env.SEED_ADMIN_PASSWORD;
    if (!password) {
      console.warn(
        "SEED_ADMIN_PASSWORD not set — skipping admin user creation. Set it and re-run, or use /admin/create-first-user.",
      );
    } else {
      await payload.create({
        collection: "users",
        data: { email, password, name: "Super Admin", role: "superadmin" },
      });
      console.log(`Created superadmin user: ${email}`);
    }
  } else {
    console.log("Users already exist — skipping admin creation.");
  }

  // --- Navigation (localized labels) ---
  for (const locale of locales) {
    const nav = messagesByLocale[locale].nav;
    await payload.updateGlobal({
      slug: "navigation",
      locale,
      data: {
        items: [
          { label: nav.home, href: "/" },
          { label: nav.mosque, href: "/unsere-moschee" },
          { label: nav.quranSchool, href: "/koranschule" },
          { label: nav.community, href: "/unser-verein" },
          { label: nav.news, href: "/aktuelles" },
          { label: nav.services, href: "/beratung-und-dienstleistung" },
          { label: nav.donate, href: "/spenden" },
          { label: nav.about, href: "/unser-verein" },
          { label: nav.contact, href: "/kontakt" },
        ],
      },
    });
  }
  console.log("Seeded Navigation for all locales.");

  // --- Footer short description ---
  for (const locale of locales) {
    await payload.updateGlobal({
      slug: "footer",
      locale,
      data: { shortDescription: messagesByLocale[locale].footer.description },
    });
  }
  console.log("Seeded Footer for all locales.");

  // --- Site settings: materialize verified defaults into the DB ---
  await payload.updateGlobal({
    slug: "site-settings",
    data: {}, // relies on each field's defaultValue; ensures a row exists
  });
  console.log("Ensured Site Settings document exists (using verified defaults).");

  // --- Services (real, scraped from afgkv.de "Beratung & Dienstleistungen") ---
  const existingServices = await payload.find({ collection: "services", limit: 1 });
  if (existingServices.totalDocs === 0) {
    type ServiceCategory =
      | "prayers"
      | "quran-school"
      | "education"
      | "social-assistance"
      | "counselling"
      | "marriage"
      | "funeral"
      | "events";

    const servicesByLocale: Record<
      (typeof locales)[number],
      { title: string; description: string; category: ServiceCategory; icon: string; linkHref: string }[]
    > = {
      de: [
        {
          title: "Bescheinigungen",
          description: "Ausstellung von Bescheinigungen für Schulen, Ämter und andere Zwecke.",
          category: "counselling",
          icon: "file-check",
          linkHref: "/beratung-und-dienstleistung",
        },
        {
          title: "Islamische Trauung",
          description: "Islamische Trauungen nach der standesamtlichen Eheschließung.",
          category: "marriage",
          icon: "heart-handshake",
          linkHref: "/beratung-und-dienstleistung",
        },
        {
          title: "Persönliche Beratung",
          description: "Unterstützung bei religiösen, familiären oder sozialen Fragestellungen.",
          category: "counselling",
          icon: "message-circle-heart",
          linkHref: "/beratung-und-dienstleistung",
        },
        {
          title: "Bestattungsbegleitung",
          description: "Beratung und Begleitung bei islamischen Bestattungen.",
          category: "funeral",
          icon: "flower-2",
          linkHref: "/beratung-und-dienstleistung",
        },
        {
          title: "Soziale Unterstützung",
          description: "Unterstützung für ältere und bedürftige Gemeindemitglieder.",
          category: "social-assistance",
          icon: "hand-heart",
          linkHref: "/beratung-und-dienstleistung",
        },
      ],
      en: [
        {
          title: "Certificates",
          description: "Issuing certificates for schools, authorities, and other purposes.",
          category: "counselling",
          icon: "file-check",
          linkHref: "/beratung-und-dienstleistung",
        },
        {
          title: "Islamic Marriage",
          description: "Islamic marriage ceremonies following civil registration.",
          category: "marriage",
          icon: "heart-handshake",
          linkHref: "/beratung-und-dienstleistung",
        },
        {
          title: "Personal Counselling",
          description: "Support for faith-related, family, or social matters.",
          category: "counselling",
          icon: "message-circle-heart",
          linkHref: "/beratung-und-dienstleistung",
        },
        {
          title: "Funeral Guidance",
          description: "Guidance and accompaniment for Islamic burials.",
          category: "funeral",
          icon: "flower-2",
          linkHref: "/beratung-und-dienstleistung",
        },
        {
          title: "Social Support",
          description: "Support for elderly and vulnerable community members.",
          category: "social-assistance",
          icon: "hand-heart",
          linkHref: "/beratung-und-dienstleistung",
        },
      ],
      fa: [],
      ps: [],
    };

    const created: Record<number, string> = {};
    for (let i = 0; i < servicesByLocale.de.length; i++) {
      const doc = await payload.create({
        collection: "services",
        locale: "de",
        data: { ...servicesByLocale.de[i], order: i },
      });
      created[i] = String(doc.id);
    }
    for (let i = 0; i < servicesByLocale.en.length; i++) {
      await payload.update({
        collection: "services",
        id: created[i],
        locale: "en",
        data: servicesByLocale.en[i],
      });
    }
    console.log("Seeded 5 real services (de/en; fa/ps flagged for translator review).");
  } else {
    console.log("Services already exist — skipping.");
  }

  // --- Quran classes (real schedule from afgkv.de "Koranschule") ---
  const existingClasses = await payload.find({ collection: "quran-classes", limit: 1 });
  if (existingClasses.totalDocs === 0) {
    await payload.create({
      collection: "quran-classes",
      locale: "de",
      data: {
        label: "Koranschule (Winter)",
        type: "koranschule",
        season: "winter",
        dayOfWeek: ["sat", "sun"],
        startTime: "11:00",
        endTime: "13:00",
        audience: ["children", "youth", "adults"],
        order: 0,
      },
    });
    await payload.create({
      collection: "quran-classes",
      locale: "de",
      data: {
        label: "Koranschule (Sommer)",
        type: "koranschule",
        season: "summer",
        dayOfWeek: ["sat", "sun"],
        startTime: "12:00",
        endTime: "14:00",
        audience: ["children", "youth", "adults"],
        order: 1,
      },
    });
    await payload.create({
      collection: "quran-classes",
      locale: "de",
      data: {
        label: "Tafsir-Unterricht",
        type: "tafsir",
        season: "year-round",
        dayOfWeek: ["mon", "sat"],
        relativeTiming: "nach dem Ischagebet",
        audience: ["youth", "adults"],
        order: 2,
      },
    });
    console.log(
      "Seeded Quran-class schedule from afgkv.de. NOTE: the mosque's live Mawaqit announcement currently lists Tafsir as Wed & Sat 20:00 — this conflicts with the afgkv.de-published Mon/Sat-after-Isha schedule seeded here. Flagged for admin verification.",
    );
  } else {
    console.log("Quran classes already exist — skipping.");
  }

  // --- Donation campaign (real title/purpose, no invented figures) ---
  const existingCampaigns = await payload.find({ collection: "donation-campaigns", limit: 1 });
  if (existingCampaigns.totalDocs === 0) {
    await payload.create({
      collection: "donation-campaigns",
      locale: "de",
      data: {
        name: "Gemeinsam unsere Moschee vollenden",
        description: {
          root: {
            type: "root",
            children: [
              {
                type: "paragraph",
                children: [
                  {
                    type: "text",
                    text: "Von baulichen Verbesserungen bis zur Innenausstattung: Wir vollenden gemeinsam Räume für Gebet und Bildung. [VERIFY FUNDING TARGET AND AMOUNT RAISED WITH THE MOSQUE BOARD]",
                  },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            version: 1,
          },
        },
        category: "renovation",
        isActive: true,
        // goalAmountCents / raisedAmountCents intentionally left empty — not yet verified.
      },
    });
    console.log("Seeded donation campaign (renovation) with no invented figures.");
  } else {
    console.log("Donation campaigns already exist — skipping.");
  }

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
