import createMiddleware from "next-intl/middleware";
import { routing } from "./lib/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip api, Next internals, Vercel internals, and all static files
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
