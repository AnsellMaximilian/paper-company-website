export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  category: string;
  paper_weight: string;
  color_name: string;
  stock: number;
  art_variant: string;
  accent: string;
};

export type StoreUser = {
  id: string;
  name: string;
  email: string;
};

export type CartLine = Product & {
  quantity: number;
};
