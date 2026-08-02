"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const LOCALE_META: Record<Locale, { label: string; flag: string }> = {
  de: { label: "Deutsch", flag: "🇩🇪" },
  en: { label: "English", flag: "🇬🇧" },
  fa: { label: "فارسی", flag: "🇦🇫" },
  ps: { label: "پښتو", flag: "🇦🇫" },
};

function useLocaleSwitch() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  return {
    locale,
    switchTo: (next: Locale) => {
      if (next === locale) return;
      router.replace(
        // @ts-expect-error -- pathname is dynamically typed per-route by next-intl
        { pathname, params },
        { locale: next },
      );
    },
  };
}

function OptionButton({
  meta,
  active,
  size,
  onClick,
}: {
  meta: { label: string; flag: string };
  active: boolean;
  size: "sm" | "lg";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex w-full items-center gap-1.5 rounded-full border font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        size === "lg" ? "min-h-11 justify-center px-3.5 py-2 text-sm" : "min-h-9 px-3 py-1.5 text-sm",
        active
          ? "border-mosque-green bg-mosque-green text-ivory"
          : "border-mosque-green/20 bg-transparent text-mosque-green-dark hover:bg-sage",
      )}
    >
      <span aria-hidden="true" className="text-base leading-none">
        {meta.flag}
      </span>
      <span>{meta.label}</span>
    </button>
  );
}

/** Always-visible row of flag + language-name pills. Used in the mobile menu, where there's room. */
function FullLanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("common");
  const { locale, switchTo } = useLocaleSwitch();

  return (
    <div role="group" aria-label={t("language")} className={cn("flex items-center gap-2", className)}>
      {locales.map((l) => (
        <OptionButton key={l} meta={LOCALE_META[l]} active={l === locale} size="lg" onClick={() => switchTo(l)} />
      ))}
    </div>
  );
}

/** Compact "current language" trigger that opens a small dropdown with all options. Used in the header, where inline space is tight. */
function CompactLanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("common");
  const { locale, switchTo } = useLocaleSwitch();
  const [open, setOpen] = useState(false);
  const current = LOCALE_META[locale as Locale];

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language")}
        className="flex min-h-9 items-center gap-1.5 rounded-full border border-mosque-green/20 px-2.5 py-1 text-xs font-medium text-mosque-green-dark transition-colors hover:bg-sage"
      >
        <span aria-hidden="true" className="text-base leading-none">
          {current.flag}
        </span>
        <span>{current.label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      {open && (
        <>
          {/* Click-away layer */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            role="listbox"
            aria-label={t("language")}
            className="absolute end-0 top-full z-50 mt-2 flex w-40 flex-col gap-1 rounded-2xl border border-mosque-green/10 bg-white p-2 shadow-xl"
          >
            {locales.map((l) => (
              <OptionButton
                key={l}
                meta={LOCALE_META[l]}
                active={l === locale}
                size="sm"
                onClick={() => {
                  switchTo(l);
                  setOpen(false);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

type LanguageSwitcherProps = {
  /** "compact": a single current-language trigger that opens a dropdown (header). "full": all 4 options always visible in a row (mobile menu). */
  variant?: "compact" | "full";
  className?: string;
};

export function LanguageSwitcher({ variant = "compact", className }: LanguageSwitcherProps) {
  return variant === "full" ? (
    <FullLanguageSwitcher className={className} />
  ) : (
    <CompactLanguageSwitcher className={className} />
  );
}
