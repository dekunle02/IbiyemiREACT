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
  name: string;
  description: string;
};
