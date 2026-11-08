import "server-only";

import { OurImpactClient } from "@our-impact/node";

const DEFAULT_BASE_URL = "https://our-impact.vercel.app";

export function getOurImpactServerConfig() {
  const secretApiKey = process.env.OUR_IMPACT_SECRET_KEY;
  const publishableKey = process.env.NEXT_PUBLIC_OUR_IMPACT_PUBLISHABLE_KEY;
  const baseUrl = (process.env.OUR_IMPACT_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, "");

  if (!secretApiKey || !publishableKey) return null;

  return {
    client: new OurImpactClient({
      secretApiKey,
      serverOptions: { baseUrl },
    }),
    publishableKey,
    baseUrl,
  };
}
