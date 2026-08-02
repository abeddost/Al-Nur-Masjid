import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";
import { getNextPrayerInfo } from "@/lib/mawaqit/get-next-prayer-info";

export async function CompactNextPrayer({ mawaqitSlug }: { mawaqitSlug: string }) {
  const info = await getNextPrayerInfo(mawaqitSlug);
  if (!info) return null;

  return <CompactNextPrayerLabel name={info.next.name} time={info.next.time} />;
}

function CompactNextPrayerLabel({ name, time }: { name: string; time: string }) {
  const t = useTranslations("prayerTimes");
  const label = name === "jumua" ? t("jumuah") : t(name as "fajr" | "dhuhr" | "asr" | "maghrib" | "isha");

  return (
    <div className="hidden items-center gap-1.5 rounded-full border border-mosque-green/15 bg-sage/70 px-3 py-1.5 text-xs font-medium text-mosque-green-dark xl:flex">
      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{label}</span>
      <span className="font-semibold">{time}</span>
    </div>
  );
}
