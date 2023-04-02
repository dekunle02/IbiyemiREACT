import axios, { AxiosInstance } from "axios";
import { Customer, Token, Product, CartItem, PaymentData } from "./interfaces";
import {
  SignInFormData,
  ChangePasswordFormData,
  ChangeUserNameFormData,
  RemissionFormData,
  CategoryFormData,
  CreditorFormData,
  ExpenseFormData,
  BusinessInfoFormData,
  UserFormData,
  ProductFormData,
} from "../constants/formData";
import { User } from "./interfaces";

export enum RequestStatus {
  Success,
  Failure,
}

export type ClientResponse = Readonly<{
  status: RequestStatus;
  data: any;
}>;

export class DjangoClient {
  axiosInstance: AxiosInstance;

  SUCCESS = RequestStatus.Success;
  FAILURE = RequestStatus.Failure;

  constructor(token?: Token) {
    let baseUrl: string = "http://127.0.0.1:8000/api/v2/";
    if (process.env.REACT_APP_DEV_MODE === "False") {
      baseUrl = "https://ibiyemi-s-5ldap.ondigitalocean.app/api/v2/";
    }
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (token) {
      this.axiosInstance = axios.create({
        baseURL: baseUrl,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access}`,
        },
      });
    }
  }

  //   GENERAL
  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //   AUTH
  async signIn(formData: SignInFormData): Promise<ClientResponse> {
    return await this.axiosInstance
      .post("accounts/signin/", formData)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async validateToken(token: Token): Promise<ClientResponse> {
    const data = { token: token.access };
    return await this.axiosInstance
      .post("accounts/token/verify/", data)
      .then((response) => ({
        status: RequestStatus.Success,
        data: { message: "Token valid" },
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: { message: "Token Invalid" },
      }));
  }

  // AUTH END

  // MANAGER START

  async getBusinessInfo(): Promise<ClientResponse> {
    return await this.axiosInstance
      .get("manager/businessinfos/1")
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: { message: "Sth went wrong.." },
      }));
  }

  async editBusinessInfo(
    formData: BusinessInfoFormData
  ): Promise<ClientResponse> {
    return await this.axiosInstance
      .patch(`manager/businessinfos/1/`, formData)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async getMostSoldProducts(
    startDate: string | null,
    limit: number | null
  ): Promise<ClientResponse> {
    return await this.axiosInstance
      .get("inventory/products/most-sold", {
        params: { start_date: startDate, limit: limit },
      })
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: { message: "Sth went wrong.." },
      }));
  }
  // MANAGER END

  // STORE FRONT
  async getProducts(category: number | null = null): Promise<ClientResponse> {
    const filter_params: any = {};
    if (category) filter_params["category"] = category;
    return await this.axiosInstance
      .get("inventory/products/", { params: filter_params })
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data as Product[],
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: { message: "Token Invalid" },
      }));
  }

  async getSimpleProducts() {
    return await this.axiosInstance
      .get("inventory/simple-products/")
      .then((response) => {
        //            f"{product.id}|f{product.name}|f{product.quantity}|f{product.unit_sell_price}|f{product.pack_sell_price}|f{product.dozen_sell_price}|f{product.pack_quantity}"
        const products: Product[] = (response.data as string[]).map(
          (productString) => {
            const [
              id,
              name,
              quantity,
              unit_sell_price,
              pack_sell_price,
              dozen_sell_price,
              pack_quantity,
            ] = productString.split("|");
            return {
              id: parseInt(id),
              name: name,
              quantity: parseInt(quantity),
              unit_cost_price: 0,
              unit_sell_price: parseInt(unit_sell_price),
              pack_sell_price: parseInt(pack_sell_price),
              dozen_sell_price: parseInt(dozen_sell_price),
              pack_quantity: parseInt(pack_quantity),
            };
          }
        );
        return { status: RequestStatus.Success, data: products };

        // status: RequestStatus.Success,
        // data: response.data as Product[],
      })
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: { message: "Token Invalid" },
      }));
  }

  async getProduct(id: number) {
    return await this.axiosInstance
      .get(`inventory/products/${id}`)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: { message: "Token Invalid" },
      }));
  }

  async addProduct(formData: ProductFormData) {
    return await this.axiosInstance
      .post("inventory/products/", formData)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async editProduct(productId: number, formData: ProductFormData) {
    return await this.axiosInstance
      .patch(`inventory/products/${productId}/`, formData)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async deleteProduct(id: number) {
    return await this.axiosInstance
      .delete(`inventory/products/${id}`)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async getSalePersons() {
    return this.axiosInstance
      .get("accounts/salespersons/")
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async addSalesperson(formData: UserFormData): Promise<ClientResponse> {
    return await this.axiosInstance
      .post("accounts/salespersons/", formData)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async deleteSalesPerson(id: number) {
    return await this.axiosInstance
      .delete(`accounts/salespersons/${id}`)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async getCreditors(): Promise<ClientResponse> {
    return this.axiosInstance
      .get("manager/creditors/")
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async addCreditor(formData: CreditorFormData): Promise<ClientResponse> {
    return await this.axiosInstance
      .post("manager/creditors/", formData)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async getCreditor(id: number): Promise<ClientResponse> {
    return await this.axiosInstance
      .get(`manager/creditors/${id}`)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async editCreditor(
    id: number,
    formData: CreditorFormData
  ): Promise<ClientResponse> {
    return await this.axiosInstance
      .patch(`manager/creditors/${id}/`, formData)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async deleteCreditor(id: number): Promise<ClientResponse> {
    return await this.axiosInstance
      .delete(`manager/creditors/${id}`)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async getExpenses(): Promise<ClientResponse> {
    return this.axiosInstance
      .get("manager/expenses/")
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async addExpense(formData: ExpenseFormData): Promise<ClientResponse> {
    return await this.axiosInstance
      .post("manager/expenses/", formData)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async getExpense(id: number): Promise<ClientResponse> {
    return await this.axiosInstance
      .get(`manager/expenses/${id}`)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async editExpense(
    id: number,
    formData: ExpenseFormData
  ): Promise<ClientResponse> {
    return await this.axiosInstance
      .patch(`manager/expenses/${id}/`, formData)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async deleteExpense(id: number): Promise<ClientResponse> {
    return await this.axiosInstance
      .delete(`manager/expenses/${id}`)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async makeSale(
    customer: Customer,
    cartItemArr: CartItem[],
    paymentData: PaymentData
  ): Promise<ClientResponse> {
    return await this.axiosInstance
      .post("store/sales/", {
        customer: customer,
        cart: cartItemArr,
        payment_data: paymentData,
      })
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data as Product[],
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: { message: "Token Invalid" },
      }));
  }

  async getSale(saleId: string): Promise<ClientResponse> {
    return await this.axiosInstance
      .get(`store/sales/${saleId}`)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data as Product[],
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: { message: "Token Invalid" },
      }));
  }
  // STORE END

  // PROFILE
  async changeProfileInfo(
    formData: ChangePasswordFormData | ChangeUserNameFormData
  ): Promise<ClientResponse> {
    return await this.axiosInstance
      .post("accounts/update/", formData)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async addRemission(formData: RemissionFormData): Promise<ClientResponse> {
    return await this.axiosInstance
      .post("manager/remits/", formData)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async getRemissions(
    user: User | null = null,
    startDate: string | null = null
  ): Promise<ClientResponse> {
    return await this.axiosInstance
      .get("manager/remits/", {
        params: { user: user?.id, start: startDate },
      })
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async getSaleItems(
    user: User | null = null,
    startDate: string | null = null,
    endDate: string | null = null
  ): Promise<ClientResponse> {
    return await this.axiosInstance
      .get("store/saleitems/", {
        params: { user: user?.id, start_date: startDate, end_date: endDate },
      })
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  // PROFILE END

  async getCategories(): Promise<ClientResponse> {
    return await this.axiosInstance
      .get("inventory/categories/")
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async addCategory(formData: CategoryFormData): Promise<ClientResponse> {
    return await this.axiosInstance
      .post("inventory/categories/", formData)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async getCategory(id: number): Promise<ClientResponse> {
    return await this.axiosInstance
      .get(`inventory/categories/${id}`)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async editCategory(
    id: number,
    formData: CategoryFormData
  ): Promise<ClientResponse> {
    return await this.axiosInstance
      .patch(`inventory/categories/${id}/`, formData)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async deleteCategory(id: number): Promise<ClientResponse> {
    return await this.axiosInstance
      .delete(`inventory/categories/${id}`)
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async getOutOfStockProducts(): Promise<ClientResponse> {
    return await this.axiosInstance
      .get("inventory/products/out")
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data as Product[],
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: { message: "Token Invalid" },
      }));
  }

  // SALES
  async getSales(
    startDate: string | null,
    limit: number | null,
    endDate?: string | undefined
  ): Promise<ClientResponse> {
    return await this.axiosInstance
      .get("store/sales/", {
        params: {
          start_date: startDate,
          limit: limit,
          end_date: endDate,
        },
      })
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  async getSalesAggregate(
    startDate: string,
    granularity: string
  ): Promise<ClientResponse> {
    return await this.axiosInstance
      .get("store/sales/sales-aggregate/", {
        params: { start_date: startDate, granularity: granularity },
      })
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data,
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: error.response.data,
      }));
  }

  // SALES END
}

const getDjango = (token?: Token): DjangoClient => new DjangoClient(token);
export default getDjango;

export {};
