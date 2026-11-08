import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Brand } from "@/components/brand";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: {
    default: "Michael Scott Paper Company",
    template: "%s · Michael Scott Paper Company",
  },
  description: "Personal paper service for Scranton offices that deserve to be remembered.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <footer className="site-footer">
          <div className="site-shell footer-grid">
            <div>
              <Brand />
              <p>Small-company attention. Big-company paper.</p>
            </div>
            <div>
              <h2>Shop</h2>
              <Link href="/shop">All paper</Link>
              <Link href="/cart">Your cart</Link>
              <Link href="/account">Order history</Link>
            </div>
            <div>
              <h2>Scranton office</h2>
              <p>1725 Slough Avenue</p>
              <p>Mon–Fri, 8:00–5:00</p>
              <p>(570) 555-PAPR</p>
            </div>
          </div>
          <div className="site-shell footer-bottom">
            <span>© 2026 Michael Scott Paper Company</span>
            <span>Paper needs met personally.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
