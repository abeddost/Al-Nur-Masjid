import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/domain/homepage/Hero";
import { PrayerTimesSection } from "@/components/domain/prayer-times/PrayerTimesSection";
import { AnnouncementCard } from "@/components/domain/homepage/AnnouncementCard";
import { ServicesGrid } from "@/components/domain/homepage/ServicesGrid";
import { QuranSchoolTeaser } from "@/components/domain/homepage/QuranSchoolTeaser";
import { DonationTeaser } from "@/components/domain/homepage/DonationTeaser";
import { NewsTeaser } from "@/components/domain/homepage/NewsTeaser";
import { AboutSection } from "@/components/domain/homepage/AboutSection";
import { VisitUsSection } from "@/components/domain/homepage/VisitUsSection";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <PrayerTimesSection />
      <AnnouncementCard />
      <ServicesGrid />
      <NewsTeaser />
      <AboutSection />
      <QuranSchoolTeaser />
      <DonationTeaser />
      <VisitUsSection />
    </>
  );
}
