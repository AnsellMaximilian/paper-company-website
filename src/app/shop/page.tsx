import { ProductCard } from "@/components/product-card";
import { sql } from "@/lib/db";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Shop paper" };

export default async function ShopPage() {
  const products = await sql<Product[]>`
    select id, slug, name, description, price_cents, category, paper_weight,
      color_name, stock, art_variant, accent
    from products where active = true
    order by price_cents asc
  `;

  return (
    <div className="page-shell">
      <section className="shop-hero site-shell">
        <span className="eyebrow dark-eyebrow">The complete shelf</span>
        <h1>Paper for every kind of important.</h1>
        <p>Six dependable ways to make your office look prepared, polished, or appropriately dramatic.</p>
      </section>
      <section className="site-shell shop-listing">
        <div className="shop-toolbar">
          <p><strong>{products.length}</strong> products</p>
          <span>Local delivery · Secure checkout</span>
        </div>
        <div className="product-grid">
          {products.map((product) => <ProductCard product={product} key={product.id} />)}
        </div>
      </section>
    </div>
  );
}
