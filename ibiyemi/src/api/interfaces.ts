export interface User {
  id: number;
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
  id: number;
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
  id?: number;
  product: Product;
  quantity: number;
  sale?: Sale;
  sell_price?: number;
}

export interface Customer {
  name?: string;
  address?: string;
  email?: string;
  phone_number?: string;
}

export interface PaymentData {
  amount_received: number;
  payment_method: string;
}

export interface Sale {
  id: number;
  amount_received: number;
  change: number;
  complete: boolean;
  cost_price: number;
  customer: Customer;
  date_ordered: string;
  payment_method: string;
  profit: number;
  sale_items: CartItem[];
  sell_price: number;
  transaction_id: string;
  user: User;
}

export interface BusinessInfo {
  address: string;
  phone_numbers: string;
  receipt_message: string;
}

export interface Remission {
  id?: string | number;
  user?: User;
  amount: number;
  description: string;
  date?: string;
  approved?: boolean;
  approved_by?: User;
}
