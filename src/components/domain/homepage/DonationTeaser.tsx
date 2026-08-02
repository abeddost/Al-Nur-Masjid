import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getActiveDonationCampaign } from "@/lib/payload/queries";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export async function DonationTeaser() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("donation");
  const campaign = await getActiveDonationCampaign(locale);

  if (!campaign) return null;

  const hasFigures = campaign.goalAmountCents != null && campaign.raisedAmountCents != null;
  const progress = hasFigures
    ? Math.min(100, Math.round(((campaign.raisedAmountCents as number) / (campaign.goalAmountCents as number)) * 100))
    : 0;

  return (
    <section className="py-16 sm:py-20">
      <Container className="grid gap-8 rounded-3xl bg-mosque-green p-8 text-ivory sm:p-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <PlaceholderImage label="ADD DONATION CAMPAIGN PHOTO" aspect="video" className="border-ivory/30 bg-ivory/10 text-ivory" />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">{t("heading")}</p>
          <h3 className="mt-2 text-2xl font-bold sm:text-3xl">{campaign.name}</h3>

          {hasFigures ? (
            <div className="mt-5">
              <div className="h-3 w-full overflow-hidden rounded-full bg-ivory/20">
                <div
                  className="h-full rounded-full bg-gold transition-[width] duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-ivory/80">{progress}%</p>
            </div>
          ) : (
            <p className="mt-4 rounded-xl bg-ivory/10 px-4 py-3 text-sm text-ivory/85">{t("pendingFigures")}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/spenden" variant="secondary">
              {t("heading")}
            </Button>
            <Button href="/spenden#transparenz" variant="ghost" className="text-ivory hover:bg-ivory/10">
              {t("transparencyLink")}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
