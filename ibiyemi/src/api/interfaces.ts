export interface User {
  username: string;
  type: string;
  last_login?: string;
}

export interface Token {
  access: string;
  refresh: string;
}

export interface Product {}
