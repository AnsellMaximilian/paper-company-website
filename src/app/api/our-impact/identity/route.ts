import { getOurImpactServerConfig } from "@/lib/our-impact";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "authentication_required" }, { status: 401 });
  }

  const config = getOurImpactServerConfig();
  if (!config) {
    return Response.json({ error: "our_impact_not_configured" }, { status: 503 });
  }

  try {
    const identity = await config.client.identity.createIdentityToken({
      body: {
        externalUserId: `mspc:${user.id}`,
        displayName: user.name,
        ttlSeconds: 900,
      },
    });

    return Response.json(
      {
        token: identity.token,
        expiresAt: identity.expiresAt.toISOString(),
        publishableKey: config.publishableKey,
        baseUrl: config.baseUrl,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return Response.json({ error: "identity_unavailable" }, { status: 502 });
  }
}
