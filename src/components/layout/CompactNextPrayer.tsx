import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";
import { getMawaqitData, getNextPrayer } from "@/lib/mawaqit/get-mawaqit-data";
import { getBerlinNow } from "@/lib/mawaqit/berlin-time";

export async function CompactNextPrayer({ mawaqitSlug }: { mawaqitSlug: string }) {
  const data = await getMawaqitData(mawaqitSlug);
  if (!data) return null;

  const { hours, minutes, isFriday } = getBerlinNow();
  const nowMinutes = hours * 60 + minutes;
  const next = getNextPrayer(data, nowMinutes, isFriday);

  return <CompactNextPrayerLabel name={next.name} time={next.time} />;
}

function CompactNextPrayerLabel({ name, time }: { name: string; time: string }) {
  const t = useTranslations("prayerTimes");
  const label = name === "jumua" ? t("jumuah") : t(name as "fajr" | "dhuhr" | "asr" | "maghrib" | "isha");

  return (
    <div className="hidden items-center gap-1.5 rounded-full border border-mosque-green/15 bg-sage/70 px-3 py-1.5 text-xs font-medium text-mosque-green-dark lg:flex">
      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{label}</span>
      <span className="font-semibold">{time}</span>
    </div>
  );
}
