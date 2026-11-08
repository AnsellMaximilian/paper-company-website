"use client";

import { OurImpact } from "@our-impact/browser";
import confetti from "canvas-confetti";
import { PartyPopper } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const BEST_FRIEND_ENTITLEMENT = "michaels_best_friend";

type IdentityResponse = {
  token: string;
  expiresAt: string;
  publishableKey: string;
  baseUrl: string;
};

type OurImpactContextValue = {
  impact: OurImpact | null;
  identityResolved: boolean;
  recheckBestFriend: () => Promise<void>;
};

const OurImpactContext = createContext<OurImpactContextValue | null>(null);

export function OurImpactProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [identity, setIdentity] = useState<IdentityResponse | null>(null);
  const [identityResolved, setIdentityResolved] = useState(false);
  const [isBestFriend, setIsBestFriend] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let refreshTimer: number | undefined;

    async function loadIdentity() {
      try {
        const response = await fetch("/api/our-impact/identity", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) {
          setIdentity(null);
          setIsBestFriend(false);
          return;
        }
        const nextIdentity = (await response.json()) as IdentityResponse;
        setIdentity(nextIdentity);
        const refreshIn = Math.max(
          60_000,
          new Date(nextIdentity.expiresAt).getTime() - Date.now() - 60_000,
        );
        refreshTimer = window.setTimeout(() => void loadIdentity(), refreshIn);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Our Impact identity could not be loaded.");
        }
      } finally {
        if (!controller.signal.aborted) setIdentityResolved(true);
      }
    }

    void loadIdentity();
    return () => {
      controller.abort();
      if (refreshTimer) window.clearTimeout(refreshTimer);
    };
  }, [pathname]);

  const impact = useMemo(
    () =>
      identity
        ? new OurImpact({
            publishableKey: identity.publishableKey,
            userToken: identity.token,
            baseUrl: identity.baseUrl,
          })
        : null,
    [identity],
  );

  const recheckBestFriend = useCallback(async () => {
    if (!impact) {
      setIsBestFriend(false);
      return;
    }

    try {
      setIsBestFriend(await impact.user.is(BEST_FRIEND_ENTITLEMENT));
    } catch {
      setIsBestFriend(false);
    }
  }, [impact]);

  useEffect(() => {
    if (!impact) return;
    void impact.refresh().then(recheckBestFriend).catch(() => setIsBestFriend(false));
  }, [impact, recheckBestFriend]);

  const contextValue = useMemo(
    () => ({ impact, identityResolved, recheckBestFriend }),
    [impact, identityResolved, recheckBestFriend],
  );

  return (
    <OurImpactContext.Provider value={contextValue}>
      {children}
      {isBestFriend && <BestFriendButton />}
    </OurImpactContext.Provider>
  );
}

export function useOurImpact() {
  const value = useContext(OurImpactContext);
  if (!value) throw new Error("useOurImpact must be used inside OurImpactProvider.");
  return value;
}

function BestFriendButton() {
  function celebrate(event: React.MouseEvent<HTMLButtonElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const origin = {
      x: (bounds.left + bounds.width / 2) / window.innerWidth,
      y: (bounds.top + bounds.height / 2) / window.innerHeight,
    };
    const colors = ["#f7c93f", "#e74332", "#fffef9", "#151515"];

    void confetti({
      particleCount: 90,
      spread: 72,
      startVelocity: 42,
      origin,
      colors,
    });
    window.setTimeout(() => {
      void confetti({
        particleCount: 45,
        spread: 110,
        startVelocity: 28,
        origin,
        colors,
      });
    }, 180);
  }

  return (
    <button
      type="button"
      className="best-friend-button"
      onClick={celebrate}
      aria-label="Celebrate being Michael's Best Friend"
    >
      <PartyPopper size={20} aria-hidden="true" />
      <span><strong>Michael&apos;s Best Friend</strong><small>Celebrate</small></span>
    </button>
  );
}
