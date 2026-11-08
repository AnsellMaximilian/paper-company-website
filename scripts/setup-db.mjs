import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required. Copy .env.example to .env.local or export it before running db:setup.");
}

const sql = postgres(connectionString, { max: 1 });

const products = [
  {
    id: "5fc8a541-3b54-4d91-b5e9-3fa279d3fc9b",
    slug: "scranton-standard",
    name: "Scranton Standard",
    description: "Dependable, bright-white copy paper for memos, invoices, and very important conference-room agendas.",
    price: 899,
    category: "Everyday",
    weight: "20 lb · 92 bright",
    color: "White",
    stock: 148,
    art: "ream",
    accent: "#f6c945",
  },
  {
    id: "1e601711-7bd5-475c-ae9a-27e214da2b9b",
    slug: "conference-room-premium",
    name: "Conference Room Premium",
    description: "A smoother heavyweight sheet for proposals that deserve a dramatic pause before page two.",
    price: 1399,
    category: "Premium",
    weight: "28 lb · 98 bright",
    color: "Brilliant White",
    stock: 73,
    art: "stack",
    accent: "#ff6b4a",
  },
  {
    id: "3b8e3a65-e3eb-4bd5-a2cb-a8522fc36d91",
    slug: "golden-ticket-ream",
    name: "Golden Ticket Ream",
    description: "Warm ivory stationery made for invitations, thank-you notes, and ideas that deserve first-class treatment.",
    price: 1699,
    category: "Stationery",
    weight: "24 lb · Linen finish",
    color: "Warm Ivory",
    stock: 42,
    art: "ticket",
    accent: "#f4b942",
  },
  {
    id: "fb618da5-3437-4d58-b0fe-24305ff275fc",
    slug: "regional-manager-letterhead",
    name: "Regional Manager Letterhead",
    description: "Crisp cotton-blend sheets for official correspondence, unofficial announcements, and bold new ventures.",
    price: 2199,
    category: "Letterhead",
    weight: "32 lb · 25% cotton",
    color: "Soft White",
    stock: 36,
    art: "letter",
    accent: "#ed4c3b",
  },
  {
    id: "59fcd853-1f8f-4cd0-8db7-3dd0efc19d6e",
    slug: "threat-level-cardstock",
    name: "Threat Level Cardstock",
    description: "Dark, cinematic cardstock for covers, table cards, and presentations that arrive with their own soundtrack.",
    price: 1899,
    category: "Cardstock",
    weight: "80 lb cover",
    color: "Midnight Black",
    stock: 58,
    art: "midnight",
    accent: "#202020",
  },
  {
    id: "eb85d476-3aaa-4b67-a2fc-1b8b0f1fbce8",
    slug: "worlds-best-boss-notepad",
    name: "World's Best Boss Notepad",
    description: "Fifty tear-away sheets for great ideas, better meetings, and reminders that absolutely cannot wait.",
    price: 699,
    category: "Desk goods",
    weight: "50 sheets · Chipboard back",
    color: "Canary Yellow",
    stock: 204,
    art: "notepad",
    accent: "#f6c945",
  },
];

try {
  await sql.unsafe(`
    create table if not exists users (
      id uuid primary key,
      name text not null,
      email text not null unique,
      password_hash text not null,
      created_at timestamptz not null default now()
    );

    create table if not exists sessions (
      id uuid primary key,
      user_id uuid not null references users(id) on delete cascade,
      token_hash text not null unique,
      expires_at timestamptz not null,
      created_at timestamptz not null default now()
    );

    create index if not exists sessions_user_id_idx on sessions(user_id);
    create index if not exists sessions_expiry_idx on sessions(expires_at);

    create table if not exists products (
      id uuid primary key,
      slug text not null unique,
      name text not null,
      description text not null,
      price_cents integer not null check (price_cents >= 0),
      category text not null,
      paper_weight text not null,
      color_name text not null,
      stock integer not null default 0 check (stock >= 0),
      art_variant text not null,
      accent text not null,
      active boolean not null default true,
      created_at timestamptz not null default now()
    );

    create table if not exists cart_items (
      user_id uuid not null references users(id) on delete cascade,
      product_id uuid not null references products(id) on delete cascade,
      quantity integer not null check (quantity > 0 and quantity <= 25),
      updated_at timestamptz not null default now(),
      primary key (user_id, product_id)
    );

    create table if not exists orders (
      id uuid primary key,
      user_id uuid not null references users(id) on delete restrict,
      status text not null default 'confirmed',
      subtotal_cents integer not null,
      shipping_cents integer not null,
      total_cents integer not null,
      created_at timestamptz not null default now()
    );

    create index if not exists orders_user_id_idx on orders(user_id, created_at desc);

    create table if not exists order_items (
      id uuid primary key,
      order_id uuid not null references orders(id) on delete cascade,
      product_id uuid not null references products(id) on delete restrict,
      product_name text not null,
      unit_price_cents integer not null,
      quantity integer not null check (quantity > 0)
    );
  `);

  for (const product of products) {
    await sql`
      insert into products (
        id, slug, name, description, price_cents, category,
        paper_weight, color_name, stock, art_variant, accent
      ) values (
        ${product.id}, ${product.slug}, ${product.name}, ${product.description},
        ${product.price}, ${product.category}, ${product.weight}, ${product.color},
        ${product.stock}, ${product.art}, ${product.accent}
      )
      on conflict (id) do update set
        slug = excluded.slug,
        name = excluded.name,
        description = excluded.description,
        price_cents = excluded.price_cents,
        category = excluded.category,
        paper_weight = excluded.paper_weight,
        color_name = excluded.color_name,
        stock = excluded.stock,
        art_variant = excluded.art_variant,
        accent = excluded.accent,
        active = true
    `;
  }

  console.log(`Database ready with ${products.length} products.`);
} finally {
  await sql.end();
}
