import { CheckCircle2, PackageOpen } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { formatDate, formatMoney } from "@/lib/format";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your account" };

type Order = {
  id: string;
  status: string;
  total_cents: number;
  created_at: Date;
  item_count: number;
  item_names: string;
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");
  const params = await searchParams;

  const orders = await sql<Order[]>`
    select o.id, o.status, o.total_cents, o.created_at,
      coalesce(sum(oi.quantity), 0)::int as item_count,
      coalesce(string_agg(oi.product_name, ', ' order by oi.product_name), '') as item_names
    from orders o
    left join order_items oi on oi.order_id = o.id
    where o.user_id = ${user.id}
    group by o.id
    order by o.created_at desc
  `;

  return (
    <div className="account-page">
      <section className="account-hero">
        <div className="site-shell account-hero-inner">
          <div><span className="eyebrow dark-eyebrow">Customer account</span><h1>Hi, {user.name.split(" ")[0]}.</h1></div>
          <div className="account-contact"><span>Signed in as</span><strong>{user.email}</strong></div>
        </div>
      </section>
      <section className="site-shell account-content">
        {params.order && (
          <div className="success-banner">
            <CheckCircle2 />
            <div><strong>Order confirmed.</strong><p>The Scranton team has it from here.</p></div>
          </div>
        )}
        <div className="account-heading">
          <div><span className="eyebrow">Order history</span><h2>Your paper trail.</h2></div>
          <Link href="/shop" className="button button-outline">Shop again</Link>
        </div>
        {orders.length === 0 ? (
          <div className="empty-state compact-empty">
            <PackageOpen size={40} />
            <h2>No orders yet.</h2>
            <p>That is easy, and frankly enjoyable, to fix.</p>
            <Link href="/shop" className="button button-dark">Browse paper</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-card" key={order.id}>
                <div className="order-number"><span>Order</span><strong>#{order.id.slice(0, 8).toUpperCase()}</strong></div>
                <div><span>Placed</span><strong>{formatDate(order.created_at)}</strong></div>
                <div className="order-items"><span>{order.item_count} items</span><strong>{order.item_names}</strong></div>
                <div><span>Total</span><strong>{formatMoney(order.total_cents)}</strong></div>
                <span className="status-pill">{order.status}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
