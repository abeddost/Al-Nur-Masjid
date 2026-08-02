/**
 * Mawaqit has no officially documented public JSON API. This parses the same
 * `confData` object that Mawaqit embeds server-side into its own public mosque
 * page (https://mawaqit.net/en/<slug>) to render its widgets — the same data a
 * visitor's browser already receives unauthenticated. If Mawaqit changes this
 * page's structure, parsing fails safely and callers get `null`, which the UI
 * treats as "temporarily unavailable" with a link back to the Mawaqit page.
 */

export type MawaqitData = {
  name: string;
  timezone: string;
  latitude: number;
  longitude: number;
  /** [fajr, dhuhr, asr, maghrib, isha] for today, "HH:mm" */
  times: [string, string, string, string, string];
  shuruq: string;
  jumua: string | null;
  jumuaAsDuhr: boolean;
  hijriAdjustment: number;
  /** [fajr, dhuhr, asr, maghrib, isha] iqama offsets in minutes for today, relative to adhan */
  iqamaOffsets: [number, number, number, number, number];
  facilities: {
    womenSpace: boolean;
    janazaPrayer: boolean;
    aidPrayer: boolean;
    childrenCourses: boolean;
    adultCourses: boolean;
    ramadanMeal: boolean;
    handicapAccessibility: boolean;
    ablutions: boolean;
    parking: boolean;
  };
  images: {
    exterior: string | null;
    interior: string | null;
  };
  flash: { content: string } | null;
  announcements: { title: string; content: string }[];
};

const MAWAQIT_URL = (slug: string) => `https://mawaqit.net/en/${slug}`;

/** Extracts the `confData` JS object literal from the page HTML, respecting string literals/escapes. */
function extractConfData(html: string): unknown | null {
  const marker = "let confData = ";
  const start = html.indexOf(marker);
  if (start === -1) return null;

  const objStart = start + marker.length;
  let depth = 0;
  let inString = false;
  let escaped = false;
  let end = -1;

  for (let i = objStart; i < html.length; i++) {
    const char = html[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }
    if (char === '"') {
      inString = true;
    } else if (char === "{") {
      depth++;
    } else if (char === "}") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }

  if (end === -1) return null;

  try {
    return JSON.parse(html.slice(objStart, end));
  } catch {
    return null;
  }
}

function parseOffset(value: unknown): number {
  const n = Number.parseInt(String(value ?? "0"), 10);
  return Number.isFinite(n) ? n : 0;
}

export async function getMawaqitData(slug: string): Promise<MawaqitData | null> {
  try {
    const res = await fetch(MAWAQIT_URL(slug), {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AnNurWebsite/1.0)" },
      next: { revalidate: 1800 },
    });
    if (!res.ok) return null;

    const html = await res.text();
    const raw = extractConfData(html) as Record<string, unknown> | null;
    if (!raw || !Array.isArray(raw.times) || raw.times.length < 5) return null;

    const berlinParts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Berlin",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(new Date());
    const month = Number(berlinParts.find((p) => p.type === "month")?.value ?? "1");
    const day = berlinParts.find((p) => p.type === "day")?.value ?? "1";
    const iqamaCalendar = raw.iqamaCalendar as Record<string, unknown>[] | undefined;
    const monthOffsets = iqamaCalendar?.[month - 1] as Record<string, unknown[]> | undefined;
    const todayOffsets = monthOffsets?.[day] as unknown[] | undefined;

    return {
      name: String(raw.name ?? ""),
      timezone: String(raw.timezone ?? "Europe/Berlin"),
      latitude: Number(raw.latitude ?? 0),
      longitude: Number(raw.longitude ?? 0),
      times: raw.times as [string, string, string, string, string],
      shuruq: String(raw.shuruq ?? ""),
      jumua: (raw.jumua as string | null) ?? null,
      jumuaAsDuhr: Boolean(raw.jumuaAsDuhr),
      hijriAdjustment: Number(raw.hijriAdjustment ?? 0),
      iqamaOffsets: [
        parseOffset(todayOffsets?.[0]),
        parseOffset(todayOffsets?.[1]),
        parseOffset(todayOffsets?.[2]),
        parseOffset(todayOffsets?.[3]),
        parseOffset(todayOffsets?.[4]),
      ],
      facilities: {
        womenSpace: Boolean(raw.womenSpace),
        janazaPrayer: Boolean(raw.janazaPrayer),
        aidPrayer: Boolean(raw.aidPrayer),
        childrenCourses: Boolean(raw.childrenCourses),
        adultCourses: Boolean(raw.adultCourses),
        ramadanMeal: Boolean(raw.ramadanMeal),
        handicapAccessibility: Boolean(raw.handicapAccessibility),
        ablutions: Boolean(raw.ablutions),
        parking: Boolean(raw.parking),
      },
      images: {
        exterior: (raw.exteriorPicture as string | null) ?? null,
        interior: (raw.interiorPicture as string | null) ?? null,
      },
      flash:
        raw.flash && typeof raw.flash === "object" && "content" in raw.flash
          ? { content: String((raw.flash as { content: unknown }).content) }
          : null,
      announcements: Array.isArray(raw.announcements)
        ? (raw.announcements as Record<string, unknown>[]).map((a) => ({
            title: String(a.title ?? ""),
            content: String(a.content ?? ""),
          }))
        : [],
    };
  } catch {
    return null;
  }
}

export const PRAYER_NAMES = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
export type PrayerName = (typeof PRAYER_NAMES)[number];

export type NextPrayer = {
  name: PrayerName | "jumua";
  time: string;
  /** Minutes since midnight, for building a Date on the client in the mosque's timezone. */
  minutesSinceMidnight: number;
};

const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Determines the next upcoming prayer (or the first prayer tomorrow) from today's times. */
export function getNextPrayer(data: MawaqitData, nowMinutes: number, isFriday: boolean): NextPrayer {
  const entries: NextPrayer[] = PRAYER_NAMES.map((name, i) => ({
    name: isFriday && name === "dhuhr" && data.jumua ? "jumua" : name,
    time: isFriday && name === "dhuhr" && data.jumua ? data.jumua : data.times[i],
    minutesSinceMidnight: toMinutes(
      isFriday && name === "dhuhr" && data.jumua ? data.jumua : data.times[i],
    ),
  }));

  const next = entries.find((entry) => entry.minutesSinceMidnight > nowMinutes);
  return next ?? { ...entries[0], minutesSinceMidnight: entries[0].minutesSinceMidnight + 24 * 60 };
}

export function addMinutes(hhmm: string, minutes: number): string {
  const total = toMinutes(hhmm) + minutes;
  const wrapped = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
