"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/** Ticks down to `targetMinutesFromNowAtMount`, purely client-side so it stays accurate without polling the server every second. */
export function Countdown({ initialSecondsRemaining }: { initialSecondsRemaining: number }) {
  const t = useTranslations("prayerTimes");
  const [secondsRemaining, setSecondsRemaining] = useState(initialSecondsRemaining);

  useEffect(() => {
    setSecondsRemaining(initialSecondsRemaining);
    const interval = setInterval(() => {
      setSecondsRemaining((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [initialSecondsRemaining]);

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <p className="font-mono text-3xl font-semibold tabular-nums text-mosque-green-dark sm:text-4xl" aria-live="off">
      <span aria-hidden="true">
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </span>
      <span className="sr-only">
        {hours} {t("countdownLabel")} {minutes}m {seconds}s
      </span>
    </p>
  );
}
