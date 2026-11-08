import { ArrowLeft, PackageCheck, Truck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { addToCartAction } from "@/app/actions/shop";
import { ProductArt } from "@/components/product-art";
import { SubmitButton } from "@/components/submit-button";
import { sql } from "@/lib/db";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rows = await sql<Product[]>`
    select id, slug, name, description, price_cents, category, paper_weight,
      color_name, stock, art_variant, accent
    from products where slug = ${slug} and active = true limit 1
  `;
  const product = rows[0];
  if (!product) notFound();

  return (
    <div className="site-shell product-page">
      <Link href="/shop" className="back-link"><ArrowLeft size={17} /> Back to all paper</Link>
      <div className="product-detail-grid">
        <ProductArt variant={product.art_variant} accent={product.accent} className="product-detail-art" />
        <div className="product-detail-copy">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-lead">{product.description}</p>
          <div className="product-specs">
            <div><span>Paper</span><strong>{product.paper_weight}</strong></div>
            <div><span>Color</span><strong>{product.color_name}</strong></div>
            <div><span>Availability</span><strong>{product.stock > 20 ? "In stock" : "Limited"}</strong></div>
          </div>
          <div className="purchase-box">
            <strong>{formatMoney(product.price_cents)}</strong>
            <span>per package</span>
            <form action={addToCartAction}>
              <input type="hidden" name="productId" value={product.id} />
              <label>Qty <input type="number" name="quantity" min="1" max="25" defaultValue="1" /></label>
              <SubmitButton pendingLabel="Adding...">Add to cart</SubmitButton>
            </form>
          </div>
          <div className="delivery-notes">
            <span><Truck size={20} /> Free Scranton delivery over $50</span>
            <span><PackageCheck size={20} /> Packed and checked by our team</span>
          </div>
        </div>
      </div>
    </div>
  );
}
