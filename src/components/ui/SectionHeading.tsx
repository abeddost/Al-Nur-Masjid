import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  align?: "center" | "start";
  tone?: "dark" | "light";
  className?: string;
};

/** Consistent eyebrow + display heading + gold rule + subheading pattern, used across homepage sections. */
export function SectionHeading({
  eyebrow,
  heading,
  subheading,
  align = "center",
  tone = "dark",
  className,
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const isLight = tone === "light";

  return (
    <div className={cn("flex flex-col", isCenter ? "items-center text-center" : "items-start text-start", className)}>
      {eyebrow && (
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.2em]",
            isLight ? "text-gold" : "text-mosque-green",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-display mt-3 text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-[2.75rem]",
          isLight ? "text-ivory" : "text-mosque-green-dark",
        )}
      >
        {heading}
      </h2>
      <span
        aria-hidden="true"
        className={cn("mt-4 h-[3px] w-14 rounded-full bg-gold", isCenter ? "" : "ms-0")}
      />
      {subheading && (
        <p className={cn("mt-4 max-w-2xl text-base leading-relaxed sm:text-lg", isLight ? "text-ivory/80" : "text-charcoal/70")}>
          {subheading}
        </p>
      )}
    </div>
  );
}
