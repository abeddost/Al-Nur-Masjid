"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

type NavItem = { label: string; href: string };

export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("common");

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-mosque-green-dark hover:bg-sage focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col bg-ivory p-6"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between">
              <LanguageSwitcher />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-mosque-green-dark hover:bg-sage focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <nav className="mt-10 flex flex-1 flex-col gap-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-4 text-lg font-semibold text-mosque-green-dark hover:bg-sage"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/spenden"
                onClick={() => setOpen(false)}
                className="mt-4 rounded-full bg-mosque-green px-6 py-4 text-center text-lg font-semibold text-ivory"
              >
                {t("donateNow")}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
