import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { addToCartAction } from "@/app/actions/shop";
import { ProductArt } from "@/components/product-art";
import { SubmitButton } from "@/components/submit-button";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link href={`/shop/${product.slug}`} className="product-card-art">
        <ProductArt variant={product.art_variant} accent={product.accent} />
      </Link>
      <div className="product-card-body">
        <div className="product-meta">
          <span>{product.category}</span>
          <span>{product.paper_weight}</span>
        </div>
        <Link href={`/shop/${product.slug}`} className="product-title-link">
          <h2>{product.name}</h2>
          <ArrowUpRight size={21} />
        </Link>
        <p>{product.description}</p>
        <div className="product-card-footer">
          <strong>{formatMoney(product.price_cents)}</strong>
          <form action={addToCartAction}>
            <input type="hidden" name="productId" value={product.id} />
            <SubmitButton className="button button-small" pendingLabel="Adding...">
              Add to cart
            </SubmitButton>
          </form>
        </div>
      </div>
    </article>
  );
}
