"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

type NavItem = { label: string; href: string };

export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("common");

  // The header has `backdrop-blur` (a backdrop-filter), which establishes a new
  // containing block for `position: fixed` descendants — without a portal, this
  // overlay would be positioned relative to the header's own box instead of the
  // viewport. Rendering into document.body sidesteps that entirely.
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const overlay = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ivory p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-mosque-green-dark hover:bg-sage focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <nav aria-label={t("menu")} className="mt-6 flex flex-1 flex-col">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-mosque-green-dark/50">
              {t("menu")}
            </p>
            <div className="flex flex-col gap-1">
              {items.map((item, i) => (
                <Link
                  key={`${item.href}-${i}`}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-4 text-lg font-semibold text-mosque-green-dark hover:bg-sage"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="mt-6 flex flex-col gap-4 border-t border-mosque-green/10 pt-6">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-mosque-green-dark/50">
                {t("language")}
              </p>
              <LanguageSwitcher variant="full" className="flex-wrap" />
            </div>
            <Link
              href="/spenden"
              onClick={() => setOpen(false)}
              className="block w-full rounded-full bg-mosque-green px-6 py-4 text-center text-lg font-semibold text-ivory"
            >
              {t("donateNow")}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-mosque-green-dark hover:bg-sage focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {mounted ? createPortal(overlay, document.body) : null}
    </div>
  );
}
