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
  // IMPORTANT: this must be a single locale:'all' write. Looping updateGlobal once per
  // locale with a fresh `items` array (as an earlier version of this script did) recreates
  // the array rows on every call, since Payload matches array rows by id and none were
  // supplied — each locale's pass silently discarded the previous locale's labels, leaving
  // only the last-processed locale (ps) with visible nav text and every other locale blank.
  const navItemDefs = [
    { href: "/", key: "home" },
    { href: "/unsere-moschee", key: "mosque" },
    { href: "/koranschule", key: "quranSchool" },
    { href: "/unser-verein", key: "community" },
    { href: "/aktuelles", key: "news" },
    { href: "/beratung-und-dienstleistung", key: "services" },
    { href: "/spenden", key: "donate" },
    { href: "/unser-verein", key: "about" },
    { href: "/kontakt", key: "contact" },
  ] as const satisfies { href: string; key: keyof (typeof messagesByLocale)["de"]["nav"] }[];

  await payload.updateGlobal({
    slug: "navigation",
    locale: "all",
    data: {
      items: navItemDefs.map((def) => ({
        href: def.href,
        label: {
          de: messagesByLocale.de.nav[def.key],
          en: messagesByLocale.en.nav[def.key],
          fa: messagesByLocale.fa.nav[def.key],
          ps: messagesByLocale.ps.nav[def.key],
        },
      })) as unknown as { href: string; label: string }[],
    },
  });
  console.log("Seeded Navigation for all locales in a single write (labels for de/en/fa/ps all set on the same rows).");

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
    fa: [
      {
        title: "گواهی‌نامه‌ها",
        description: "صدور گواهی‌نامه برای مکاتب، ادارات و سایر اهداف.",
        category: "counselling",
        icon: "file-check",
        linkHref: "/beratung-und-dienstleistung",
      },
      {
        title: "ازدواج اسلامی",
        description: "برگزاری مراسم ازدواج اسلامی پس از ثبت رسمی ازدواج.",
        category: "marriage",
        icon: "heart-handshake",
        linkHref: "/beratung-und-dienstleistung",
      },
      {
        title: "مشاوره شخصی",
        description: "حمایت در مسائل دینی، خانوادگی یا اجتماعی.",
        category: "counselling",
        icon: "message-circle-heart",
        linkHref: "/beratung-und-dienstleistung",
      },
      {
        title: "همراهی در تشییع جنازه",
        description: "مشاوره و همراهی در مراسم تدفین اسلامی.",
        category: "funeral",
        icon: "flower-2",
        linkHref: "/beratung-und-dienstleistung",
      },
      {
        title: "حمایت اجتماعی",
        description: "حمایت از اعضای سالخورده و نیازمند جامعه.",
        category: "social-assistance",
        icon: "hand-heart",
        linkHref: "/beratung-und-dienstleistung",
      },
    ],
    ps: [
      {
        title: "تصدیقونه",
        description: "د ښوونځیو، ادارو او نورو موخو لپاره د تصدیق لیکونو صادرول.",
        category: "counselling",
        icon: "file-check",
        linkHref: "/beratung-und-dienstleistung",
      },
      {
        title: "اسلامي واده",
        description: "د رسمي واده ثبت وروسته اسلامي د واده مراسم.",
        category: "marriage",
        icon: "heart-handshake",
        linkHref: "/beratung-und-dienstleistung",
      },
      {
        title: "شخصي مشوره",
        description: "په ديني، کورنیو یا ټولنیزو مسایلو کې مرسته.",
        category: "counselling",
        icon: "message-circle-heart",
        linkHref: "/beratung-und-dienstleistung",
      },
      {
        title: "د جنازې مرسته",
        description: "د اسلامي ښخولو لپاره مشوره او ملاتړ.",
        category: "funeral",
        icon: "flower-2",
        linkHref: "/beratung-und-dienstleistung",
      },
      {
        title: "ټولنیزه مرسته",
        description: "د ټولنې د زړو او اړمنو غړو لپاره مرسته.",
        category: "social-assistance",
        icon: "hand-heart",
        linkHref: "/beratung-und-dienstleistung",
      },
    ],
  };

  const existingServices = await payload.find({ collection: "services", locale: "de", sort: "order", limit: 10 });
  let serviceIds: string[];
  if (existingServices.totalDocs === 0) {
    serviceIds = [];
    for (let i = 0; i < servicesByLocale.de.length; i++) {
      const doc = await payload.create({
        collection: "services",
        locale: "de",
        data: { ...servicesByLocale.de[i], order: i },
      });
      serviceIds.push(String(doc.id));
    }
    console.log("Created 5 real services (de).");
  } else {
    serviceIds = existingServices.docs.map((d) => String(d.id));
    console.log("Services already exist — updating translations only.");
  }
  for (const locale of ["en", "fa", "ps"] as const) {
    for (let i = 0; i < serviceIds.length && i < servicesByLocale[locale].length; i++) {
      await payload.update({ collection: "services", id: serviceIds[i], locale, data: servicesByLocale[locale][i] });
    }
  }
  console.log("Synced service translations for en/fa/ps (fa/ps flagged for native-speaker review).");

  // --- Quran classes (real schedule from afgkv.de "Koranschule") ---
  type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  type Audience = "children" | "youth" | "adults";

  const quranClassesShared: {
    type: "koranschule" | "tafsir";
    season: "winter" | "summer" | "year-round";
    dayOfWeek: Weekday[];
    startTime?: string;
    endTime?: string;
    audience: Audience[];
    order: number;
  }[] = [
    {
      type: "koranschule",
      season: "winter",
      dayOfWeek: ["sat", "sun"],
      startTime: "11:00",
      endTime: "13:00",
      audience: ["children", "youth", "adults"],
      order: 0,
    },
    {
      type: "koranschule",
      season: "summer",
      dayOfWeek: ["sat", "sun"],
      startTime: "12:00",
      endTime: "14:00",
      audience: ["children", "youth", "adults"],
      order: 1,
    },
    {
      type: "tafsir",
      season: "year-round",
      dayOfWeek: ["mon", "sat"],
      audience: ["youth", "adults"],
      order: 2,
    },
  ];

  const quranLabelsByLocale: Record<(typeof locales)[number], string[]> = {
    de: ["Koranschule (Winter)", "Koranschule (Sommer)", "Tafsir-Unterricht"],
    en: ["Quran School (Winter)", "Quran School (Summer)", "Tafsir Class"],
    fa: ["مکتب قرآن (زمستان)", "مکتب قرآن (تابستان)", "درس تفسیر"],
    ps: ["قرآني ښوونځی (ژمی)", "قرآني ښوونځی (دوبی)", "د تفسیر درس"],
  };
  const quranRelativeTimingByLocale: Record<(typeof locales)[number], (string | undefined)[]> = {
    de: [undefined, undefined, "nach dem Ischagebet"],
    en: [undefined, undefined, "after Isha prayer"],
    fa: [undefined, undefined, "بعد از نماز عشاء"],
    ps: [undefined, undefined, "د ماخستن لمانځه وروسته"],
  };

  const existingClasses = await payload.find({
    collection: "quran-classes",
    locale: "de",
    sort: "order",
    limit: 10,
  });
  let quranClassIds: string[];
  if (existingClasses.totalDocs === 0) {
    quranClassIds = [];
    for (let i = 0; i < quranClassesShared.length; i++) {
      const doc = await payload.create({
        collection: "quran-classes",
        locale: "de",
        data: {
          ...quranClassesShared[i],
          label: quranLabelsByLocale.de[i],
          relativeTiming: quranRelativeTimingByLocale.de[i],
        },
      });
      quranClassIds.push(String(doc.id));
    }
    console.log(
      "Created Quran-class schedule from afgkv.de. NOTE: the mosque's live Mawaqit announcement currently lists Tafsir as Wed & Sat 20:00 — this conflicts with the afgkv.de-published Mon/Sat-after-Isha schedule seeded here. Flagged for admin verification.",
    );
  } else {
    quranClassIds = existingClasses.docs.map((d) => String(d.id));
    console.log("Quran classes already exist — updating translations only.");
  }
  for (const locale of ["en", "fa", "ps"] as const) {
    for (let i = 0; i < quranClassIds.length; i++) {
      await payload.update({
        collection: "quran-classes",
        id: quranClassIds[i],
        locale,
        data: {
          label: quranLabelsByLocale[locale][i],
          relativeTiming: quranRelativeTimingByLocale[locale][i],
        },
      });
    }
  }
  console.log("Synced Quran-class translations for en/fa/ps.");

  // --- Donation campaign (real title/purpose, no invented figures) ---
  const campaignNameByLocale: Record<(typeof locales)[number], string> = {
    de: "Gemeinsam unsere Moschee vollenden",
    en: "Together, Completing Our Mosque",
    fa: "با هم مسجد خود را تکمیل می‌کنیم",
    ps: "راځئ خپل جومات یوځای بشپړ کړو",
  };

  const richTextParagraph = (text: string, direction: "ltr" | "rtl") => ({
    root: {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", text }],
          direction,
          format: "" as const,
          indent: 0,
          version: 1,
        },
      ],
      direction,
      format: "" as const,
      indent: 0,
      version: 1,
    },
  });

  const campaignDescriptionByLocale: Record<(typeof locales)[number], { text: string; dir: "ltr" | "rtl" }> = {
    de: {
      text: "Von baulichen Verbesserungen bis zur Innenausstattung: Wir vollenden gemeinsam Räume für Gebet und Bildung. [VERIFY FUNDING TARGET AND AMOUNT RAISED WITH THE MOSQUE BOARD]",
      dir: "ltr",
    },
    en: {
      text: "From structural improvements to interior furnishings: together we're completing spaces for prayer and education. [VERIFY FUNDING TARGET AND AMOUNT RAISED WITH THE MOSQUE BOARD]",
      dir: "ltr",
    },
    fa: {
      text: "از بهبود ساختمانی تا تجهیز داخلی: ما با هم فضاهایی برای نماز و آموزش تکمیل می‌کنیم. [ارقام هدف و مبلغ جمع‌آوری‌شده هنوز باید توسط هیئت مسجد تأیید شود]",
      dir: "rtl",
    },
    ps: {
      text: "له ساختماني ښېګڼو نیولې تر داخلي تجهیزاتو: موږ په ګډه د لمانځه او زده‌کړې ځایونه بشپړوو. [د تمویل موخه او راټول شوی اندازه لا تر اوسه د جومات له اداري بورډ سره تایید ته اړتیا لري]",
      dir: "rtl",
    },
  };

  const existingCampaigns = await payload.find({ collection: "donation-campaigns", locale: "de", limit: 1 });
  let campaignId: string;
  if (existingCampaigns.totalDocs === 0) {
    const doc = await payload.create({
      collection: "donation-campaigns",
      locale: "de",
      data: {
        name: campaignNameByLocale.de,
        description: richTextParagraph(campaignDescriptionByLocale.de.text, campaignDescriptionByLocale.de.dir),
        category: "renovation",
        isActive: true,
        // goalAmountCents / raisedAmountCents intentionally left empty — not yet verified.
      },
    });
    campaignId = String(doc.id);
    console.log("Created donation campaign (renovation) with no invented figures.");
  } else {
    campaignId = String(existingCampaigns.docs[0].id);
    console.log("Donation campaign already exists — updating translations only.");
  }
  for (const locale of ["en", "fa", "ps"] as const) {
    await payload.update({
      collection: "donation-campaigns",
      id: campaignId,
      locale,
      data: {
        name: campaignNameByLocale[locale],
        description: richTextParagraph(campaignDescriptionByLocale[locale].text, campaignDescriptionByLocale[locale].dir),
      },
    });
  }
  console.log("Synced donation campaign name for en/fa/ps.");

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
