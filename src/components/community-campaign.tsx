"use client";

import { mountCampaign, type CampaignWidgetStatus } from "@our-impact/browser";
import { useEffect, useRef, useState } from "react";
import { useOurImpact } from "@/components/our-impact-provider";

const CAMPAIGN_PUBLIC_ID = "celebrating-michael-s-amazing-generosity-68fd6a57";

export function CommunityCampaign() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<CampaignWidgetStatus>("loading");
  const { impact, identityResolved, recheckBestFriend } = useOurImpact();

  useEffect(() => {
    if (!mountRef.current || !identityResolved) return;

    const options = {
      target: mountRef.current,
      publicId: CAMPAIGN_PUBLIC_ID,
      title: "Vote in Michael Scott Paper Company's community campaign",
      height: "auto" as const,
      minHeight: 520,
      borderRadius: 0,
      onStatusChange: setStatus,
      onDonationCompleted() {
        void recheckBestFriend();
      },
    };
    const campaign = impact
      ? impact.widgets.mountCampaign(options)
      : mountCampaign(options);

    return () => campaign.destroy();
  }, [identityResolved, impact, recheckBestFriend]);

  return (
    <div className="community-campaign-frame">
      <div
        ref={mountRef}
        aria-busy={status === "loading"}
        data-status={status}
      />
      {status === "loading" && (
        <p className="community-campaign-loading" role="status">
          Loading the community ballot…
        </p>
      )}
      {status === "error" && (
        <p className="community-campaign-error" role="alert">
          The community ballot could not be loaded. Please try again shortly.
        </p>
      )}
    </div>
  );
}
