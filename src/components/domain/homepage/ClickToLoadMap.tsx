"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

/**
 * Loads no external map traffic until the visitor opts in — a lightweight stand-in
 * for the full cookie-consent gate planned for the SEO/privacy hardening phase.
 */
export function ClickToLoadMap({
  latitude,
  longitude,
  label,
  loadLabel,
}: {
  latitude: number;
  longitude: number;
  label: string;
  loadLabel: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const delta = 0.006;
  const bbox = `${longitude - delta}%2C${latitude - delta}%2C${longitude + delta}%2C${latitude + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  if (loaded) {
    return (
      <iframe
        title={label}
        src={src}
        className="h-full w-full rounded-2xl border border-mosque-green/10"
        loading="lazy"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-mosque-green/25 bg-sage/60 p-6 text-center text-mosque-green-dark hover:bg-sage"
    >
      <MapPin className="h-8 w-8" aria-hidden="true" />
      <span className="text-sm font-semibold">{loadLabel}</span>
    </button>
  );
}
