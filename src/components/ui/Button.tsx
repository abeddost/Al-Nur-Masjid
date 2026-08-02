import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";

const variantClass: Record<Variant, string> = {
  primary: "bg-mosque-green text-ivory hover:bg-mosque-green-dark",
  secondary: "bg-gold text-charcoal hover:bg-gold/90",
  outline: "border border-mosque-green text-mosque-green hover:bg-mosque-green hover:text-ivory",
  ghost: "text-mosque-green hover:bg-sage",
};

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold min-h-11";

type ButtonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

export function Button({
  variant = "primary",
  children,
  className,
  href,
  ...props
}: ButtonProps & ({ href: string } & Omit<ComponentProps<typeof Link>, "href">)) {
  return (
    <Link href={href} className={cn(baseClass, variantClass[variant], className)} {...props}>
      {children}
    </Link>
  );
}
