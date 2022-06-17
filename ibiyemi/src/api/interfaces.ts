export interface User {
  username: string;
  type: string;
  last_login?: string;
}

export interface Token {
  access: string;
  refresh: string;
}

export interface Category {
  id: number | string;
  name: string;
  description?: string;
}

export interface Product {
  id: number | string;
  name: string;
  description?: string;
  category?: Category;
  unit_cost_price: number;
  unit_sell_price: number;
  pack_cost_price?: number;
  pack_sell_price?: number;
  dozen_cost_price?: number;
  dozen_sell_price?: number;
  barcode?: string;
  quantity: number;
  notify_quantity?: number;
  pack_quantity?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Customer {
  name?: string;
  address?: string;
  email?: string;
  phone_number?: string;
}
