"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Announcement = {
  id: string;
  message: string;
  link?: string | null;
  variant: "info" | "warning" | "urgent";
};

const variantClass: Record<Announcement["variant"], string> = {
  info: "bg-mosque-green text-ivory",
  warning: "bg-gold text-charcoal",
  urgent: "bg-[#7a2222] text-ivory",
};

export function AnnouncementBar({ announcement }: { announcement: Announcement | null }) {
  const t = useTranslations("announcementBar");
  const [dismissed, setDismissed] = useState(false);

  if (!announcement || dismissed) return null;

  return (
    <div className={cn("relative flex items-center justify-center px-4 py-2 text-center text-sm", variantClass[announcement.variant])}>
      <p className="mx-6">
        {announcement.link ? (
          <a href={announcement.link} className="underline underline-offset-2 hover:no-underline">
            {announcement.message}
          </a>
        ) : (
          announcement.message
        )}
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label={t("close")}
        className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
