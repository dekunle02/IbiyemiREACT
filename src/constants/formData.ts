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
