import { ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { Brand } from "@/components/brand";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function SiteHeader() {
  const user = await getCurrentUser();
  const cartRows = user
    ? await sql<Array<{ count: number }>>`
        select coalesce(sum(quantity), 0)::int as count
        from cart_items where user_id = ${user.id}
      `
    : [];
  const cartCount = cartRows[0]?.count ?? 0;

  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Brand />
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/shop">Shop paper</Link>
          <Link href="/#community">Community</Link>
          <Link href="/#story">Our story</Link>
          <Link href="/#service">Service</Link>
        </nav>
        <div className="header-actions">
          {user ? (
            <>
              <Link href="/account" className="icon-link">
                <UserRound size={18} />
                <span>{user.name.split(" ")[0]}</span>
              </Link>
              <form action={logoutAction}>
                <button className="text-button" type="submit">Sign out</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="text-button">Sign in</Link>
          )}
          <Link href="/cart" className="cart-link" aria-label={`Cart with ${cartCount} items`}>
            <ShoppingBag size={19} />
            <span>Cart</span>
            {cartCount > 0 && <b>{cartCount}</b>}
          </Link>
        </div>
      </div>
    </header>
  );
}
