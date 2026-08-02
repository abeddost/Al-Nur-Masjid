const TIME_ZONE = "Europe/Berlin";

/** Current wall-clock time in Europe/Berlin, independent of server/browser locale timezone. */
export function getBerlinNow(): { hours: number; minutes: number; isFriday: boolean; date: Date } {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    weekday: "short",
  }).formatToParts(now);

  const hours = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minutes = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";

  return { hours, minutes, isFriday: weekday === "Fri", date: now };
}
