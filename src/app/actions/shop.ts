"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/shop");
  return user;
}

export async function addToCartAction(formData: FormData) {
  const user = await requireUser();
  const productId = String(formData.get("productId") ?? "");
  const requested = Number(formData.get("quantity") ?? 1);
  const quantity = Number.isInteger(requested) ? Math.min(Math.max(requested, 1), 25) : 1;

  const products = await sql<Array<{ id: string; stock: number }>>`
    select id, stock from products where id = ${productId} and active = true limit 1
  `;
  if (!products[0]) return;

  await sql`
    insert into cart_items (user_id, product_id, quantity)
    values (${user.id}, ${productId}, ${Math.min(quantity, products[0].stock)})
    on conflict (user_id, product_id) do update set
      quantity = least(cart_items.quantity + excluded.quantity, 25, ${products[0].stock}),
      updated_at = now()
  `;

  revalidatePath("/shop");
  revalidatePath("/cart");
  revalidatePath("/", "layout");
}

export async function updateCartAction(formData: FormData) {
  const user = await requireUser();
  const productId = String(formData.get("productId") ?? "");
  const quantity = Number(formData.get("quantity") ?? 1);

  if (!Number.isInteger(quantity) || quantity <= 0) {
    await sql`delete from cart_items where user_id = ${user.id} and product_id = ${productId}`;
  } else {
    await sql`
      update cart_items
      set quantity = least(${quantity}, 25), updated_at = now()
      where user_id = ${user.id} and product_id = ${productId}
    `;
  }

  revalidatePath("/cart");
  revalidatePath("/", "layout");
}

export async function removeCartItemAction(formData: FormData) {
  const user = await requireUser();
  const productId = String(formData.get("productId") ?? "");
  await sql`delete from cart_items where user_id = ${user.id} and product_id = ${productId}`;
  revalidatePath("/cart");
  revalidatePath("/", "layout");
}

export async function checkoutAction() {
  const user = await requireUser();
  const orderId = randomUUID();

  const created = await sql.begin(async (transaction) => {
    const items = await transaction<Array<{
      product_id: string;
      name: string;
      price_cents: number;
      quantity: number;
      stock: number;
    }>>`
      select p.id as product_id, p.name, p.price_cents, ci.quantity, p.stock
      from cart_items ci
      join products p on p.id = ci.product_id
      where ci.user_id = ${user.id}
      order by ci.updated_at desc
      for update of p
    `;

    if (items.length === 0 || items.some((item) => item.quantity > item.stock)) {
      return false;
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.price_cents * item.quantity,
      0,
    );
    const shipping = subtotal >= 5000 ? 0 : 895;

    await transaction`
      insert into orders (id, user_id, status, subtotal_cents, shipping_cents, total_cents)
      values (${orderId}, ${user.id}, 'confirmed', ${subtotal}, ${shipping}, ${subtotal + shipping})
    `;

    for (const item of items) {
      await transaction`
        insert into order_items (
          id, order_id, product_id, product_name, unit_price_cents, quantity
        ) values (
          ${randomUUID()}, ${orderId}, ${item.product_id}, ${item.name},
          ${item.price_cents}, ${item.quantity}
        )
      `;
      await transaction`
        update products set stock = stock - ${item.quantity} where id = ${item.product_id}
      `;
    }

    await transaction`delete from cart_items where user_id = ${user.id}`;
    return true;
  });

  if (!created) redirect("/cart?error=stock");
  revalidatePath("/", "layout");
  redirect(`/account?order=${orderId}`);
}
