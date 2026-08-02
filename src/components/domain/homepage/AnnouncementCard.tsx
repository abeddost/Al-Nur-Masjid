import { getLocale, getTranslations } from "next-intl/server";
import { Megaphone } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { getActiveAnnouncement } from "@/lib/payload/queries";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const variantClass = {
  info: "border-mosque-green/20 bg-sage",
  warning: "border-gold/40 bg-gold/10",
  urgent: "border-[#7a2222]/30 bg-[#7a2222]/5",
};

export async function AnnouncementCard() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("announcements");
  const announcement = await getActiveAnnouncement(locale);

  if (!announcement) return null;

  return (
    <section className="py-10">
      <Container>
        <Reveal>
          <div className={`flex items-start gap-4 rounded-2xl border p-6 ${variantClass[announcement.variant]}`}>
            <Megaphone className="mt-0.5 h-6 w-6 shrink-0 text-mosque-green-dark" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-mosque-green-dark/70">
                {t("heading")}
              </p>
              <p className="mt-1 text-charcoal">
                {announcement.link ? (
                  <a href={announcement.link} className="underline underline-offset-2 hover:no-underline">
                    {announcement.message}
                  </a>
                ) : (
                  announcement.message
                )}
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
