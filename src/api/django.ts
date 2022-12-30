import axios, { AxiosInstance } from "axios";
import { Customer, Token, Product, CartItem, PaymentData } from "./interfaces";
import {
  SignInFormData,
  ChangePasswordFormData,
  ChangeUserNameFormData,
  RemissionFormData,
  CategoryFormData,
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
      .get("inventory/products", { params: filter_params })
      .then((response) => ({
        status: RequestStatus.Success,
        data: response.data as Product[],
      }))
      .catch((error) => ({
        status: RequestStatus.Failure,
        data: { message: "Token Invalid" },
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
