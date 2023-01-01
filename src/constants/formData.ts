export type UserFormData = {
  username: string;
  password: string;
};

export type SignInFormData = {
  username?: string;
  password?: string;
};

export type CustomerFormData = {
  name?: string;
  address?: string;
  email?: string;
  phone_number?: string;
};

export type ChangeUserNameFormData = {
  username: string;
};

export type ChangePasswordFormData = {
  old_password: string;
  password: string;
};

export type RemissionFormData = {
  amount: number | string;
  description: string;
};

export type CategoryFormData = {
  name?: string;
  description?: string;
};

export type CreditorFormData = {
  name?: string;
  phone_number?: string;
  amount?: number | string;
};

export type ExpenseFormData = {
  name?: string;
  amount?: number | string;
  description?: string;
  due_date?: string;
};

export type BusinessInfoFormData = {
  address?: string;
  phone_numbers?: string;
  receipt_message?: string;
};

export type ProductFormData = {
  name: string;
  description?: string;
  category?: number;
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
};
