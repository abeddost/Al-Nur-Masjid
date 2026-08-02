import { getMawaqitData, getNextPrayer, type MawaqitData, type NextPrayer } from "@/lib/mawaqit/get-mawaqit-data";
import { getBerlinNow } from "@/lib/mawaqit/berlin-time";

export type NextPrayerInfo = {
  data: MawaqitData;
  next: NextPrayer;
  initialSecondsRemaining: number;
};

/** Shared by the hero's compact widget and the full prayer-times section so both agree on "now". */
export async function getNextPrayerInfo(mawaqitSlug: string): Promise<NextPrayerInfo | null> {
  const data = await getMawaqitData(mawaqitSlug);
  if (!data) return null;

  const { hours, minutes, isFriday } = getBerlinNow();
  const nowMinutes = hours * 60 + minutes;
  const next = getNextPrayer(data, nowMinutes, isFriday);
  const nowSeconds = hours * 3600 + minutes * 60;
  const targetSeconds = next.minutesSinceMidnight * 60;
  const initialSecondsRemaining = Math.max(0, targetSeconds - nowSeconds);

  return { data, next, initialSecondsRemaining };
}
