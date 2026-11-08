import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  checkoutAction,
  removeCartItemAction,
  updateCartAction,
} from "@/app/actions/shop";
import { ProductArt } from "@/components/product-art";
import { SubmitButton } from "@/components/submit-button";
import { sql } from "@/lib/db";
import { formatMoney } from "@/lib/format";
import { getCurrentUser } from "@/lib/session";
import type { CartLine } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your cart" };

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/cart");

  const params = await searchParams;
  const items = await sql<CartLine[]>`
    select p.id, p.slug, p.name, p.description, p.price_cents, p.category,
      p.paper_weight, p.color_name, p.stock, p.art_variant, p.accent, ci.quantity
    from cart_items ci
    join products p on p.id = ci.product_id
    where ci.user_id = ${user.id}
    order by ci.updated_at desc
  `;

  const subtotal = items.reduce((sum, item) => sum + item.price_cents * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 5000 ? 0 : 895;

  return (
    <div className="site-shell cart-page">
      <Link href="/shop" className="back-link"><ArrowLeft size={17} /> Keep shopping</Link>
      <div className="cart-title-row">
        <div><span className="eyebrow">Your order</span><h1>Paper cart.</h1></div>
        <span>{items.reduce((sum, item) => sum + item.quantity, 0)} items</span>
      </div>

      {params.error === "stock" && (
        <p className="cart-alert">One of those quantities is no longer available. Review the cart and try again.</p>
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <ShoppingBag size={42} />
          <h2>Your cart is exceptionally organized.</h2>
          <p>Possibly because there is nothing in it yet.</p>
          <Link href="/shop" className="button button-dark">Shop paper</Link>
        </div>
      ) : (
        <div className="cart-grid">
          <div className="cart-lines">
            {items.map((item) => (
              <article className="cart-line" key={item.id}>
                <ProductArt variant={item.art_variant} accent={item.accent} />
                <div className="cart-line-copy">
                  <span>{item.category}</span>
                  <Link href={`/shop/${item.slug}`}><h2>{item.name}</h2></Link>
                  <p>{item.paper_weight} · {item.color_name}</p>
                  <div className="cart-line-actions">
                    <form action={updateCartAction}>
                      <input type="hidden" name="productId" value={item.id} />
                      <label>Qty <input type="number" name="quantity" defaultValue={item.quantity} min="0" max="25" /></label>
                      <button type="submit">Update</button>
                    </form>
                    <form action={removeCartItemAction}>
                      <input type="hidden" name="productId" value={item.id} />
                      <button className="remove-button" type="submit"><Trash2 size={15} /> Remove</button>
                    </form>
                  </div>
                </div>
                <strong>{formatMoney(item.price_cents * item.quantity)}</strong>
              </article>
            ))}
          </div>
          <aside className="order-summary">
            <span className="eyebrow">Order summary</span>
            <h2>Ready for the route.</h2>
            <dl>
              <div><dt>Subtotal</dt><dd>{formatMoney(subtotal)}</dd></div>
              <div><dt>Local delivery</dt><dd>{shipping === 0 ? "Free" : formatMoney(shipping)}</dd></div>
              <div className="summary-total"><dt>Total</dt><dd>{formatMoney(subtotal + shipping)}</dd></div>
            </dl>
            {shipping > 0 && <p>Add {formatMoney(5000 - subtotal)} more for free local delivery.</p>}
            <form action={checkoutAction}>
              <SubmitButton pendingLabel="Placing order...">Place test order</SubmitButton>
            </form>
            <small>This demo checkout records an order but does not charge a payment method.</small>
          </aside>
        </div>
      )}
    </div>
  );
}
