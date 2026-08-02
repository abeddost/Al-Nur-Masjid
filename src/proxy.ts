import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export const proxy = createMiddleware(routing);

// Next.js 16.2.x still reads the matcher from an export named `config`,
// even though the file/function itself follow the new `proxy.ts` convention.
export const config = {
  matcher: ["/((?!api|admin|_next|.*\\..*).*)"],
};
