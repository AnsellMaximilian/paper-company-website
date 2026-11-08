import { ArrowRight, BadgeCheck, Boxes, Handshake, PhoneCall } from "lucide-react";
import Link from "next/link";
import { ProductArt } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { sql } from "@/lib/db";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await sql<Product[]>`
    select id, slug, name, description, price_cents, category, paper_weight,
      color_name, stock, art_variant, accent
    from products where active = true
    order by created_at asc
    limit 3
  `;

  return (
    <>
      <section className="hero-section">
        <div className="site-shell hero-grid">
          <div className="hero-copy">
            <span className="eyebrow dark-eyebrow">Independent paper people · Scranton, PA</span>
            <h1>Paper is personal.<br />So is our service.</h1>
            <p>
              Reliable office paper, thoughtful recommendations, and a real person who
              remembers how you take your invoices.
            </p>
            <div className="hero-actions">
              <Link href="/shop" className="button button-dark">
                Shop our paper <ArrowRight size={19} />
              </Link>
              <Link href="/register" className="button button-white">Open an account</Link>
            </div>
          </div>
          <div className="hero-sign" aria-label="Michael Scott Paper Company sign">
            <div className="sign-shadow" />
            <div className="sign-board">
              <span>Michael Scott</span>
              <strong>Paper Company</strong>
              <small>Meeting Scranton’s paper needs since 2009</small>
            </div>
            <div className="hero-reams">
              <ProductArt variant="ream" accent="#f6c945" />
            </div>
          </div>
        </div>
        <div className="ticker" aria-hidden="true">
          <span>Free local delivery over $50</span><b>★</b>
          <span>Real people answer the phone</span><b>★</b>
          <span>Business accounts welcome</span><b>★</b>
          <span>Paper with personality</span>
        </div>
      </section>

      <section className="section" id="service">
        <div className="site-shell">
          <div className="section-heading split-heading">
            <div>
              <span className="eyebrow">Popular around the office</span>
              <h2>The good stuff.</h2>
            </div>
            <p>From the everyday workhorse to the sheet you save for the big pitch.</p>
          </div>
          <div className="product-grid">
            {featured.map((product) => <ProductCard product={product} key={product.id} />)}
          </div>
          <div className="center-action">
            <Link href="/shop" className="button button-outline">Browse all paper <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="story-section" id="story">
        <div className="site-shell story-grid">
          <div className="story-poster">
            <span className="poster-kicker">Our promise</span>
            <strong>Big paper energy.</strong>
            <strong>Small paper company.</strong>
            <div className="poster-seal">MS<br /><small>PC</small></div>
          </div>
          <div className="story-copy">
            <span className="eyebrow">Why buy independent?</span>
            <h2>Your paper rep should know your name.</h2>
            <p>
              We started with one conviction: an office supply relationship can feel like
              an actual relationship. No maze of account numbers. No twelve-step support
              tickets. Just good paper and somebody accountable for getting it to you.
            </p>
            <div className="promise-list">
              <Promise icon={<PhoneCall />} title="A human picks up" copy="Questions go to a person, not a queue." />
              <Promise icon={<Boxes />} title="Stock you can count on" copy="Practical papers selected for real offices." />
              <Promise icon={<Handshake />} title="Service with memory" copy="We learn what your team actually uses." />
              <Promise icon={<BadgeCheck />} title="No corporate runaround" copy="If something is wrong, we make it right." />
            </div>
          </div>
        </div>
      </section>

      <section className="account-cta">
        <div className="site-shell account-cta-inner">
          <div>
            <span className="eyebrow dark-eyebrow">Ready when you are</span>
            <h2>Make your next paper order remarkably painless.</h2>
          </div>
          <Link href="/register" className="button button-dark">Create an account <ArrowRight size={19} /></Link>
        </div>
      </section>
    </>
  );
}

function Promise({
  icon,
  title,
  copy,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <div className="promise-item">
      <span>{icon}</span>
      <div><strong>{title}</strong><p>{copy}</p></div>
    </div>
  );
}
