"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { useParams } from "next/navigation";

const NATIVE_NAMES: Record<(typeof locales)[number], string> = {
  de: "Deutsch",
  en: "English",
  fa: "دری",
  ps: "پښتو",
};

export function LanguageSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  return (
    <label className="relative flex items-center gap-1.5 text-sm font-medium text-mosque-green-dark">
      <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="sr-only">{t("language")}</span>
      <select
        value={locale}
        onChange={(e) => {
          router.replace(
            // @ts-expect-error -- pathname is dynamically typed per-route by next-intl
            { pathname, params },
            { locale: e.target.value },
          );
        }}
        className="cursor-pointer appearance-none rounded-full border border-mosque-green/20 bg-transparent py-1.5 ps-2 pe-6 hover:bg-sage focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {NATIVE_NAMES[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
