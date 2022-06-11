import axios, { AxiosInstance } from "axios";
import { Token } from "./interfaces";
import { SignInFormData } from "../constants/formData";

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
}

const getDjango = (token?: Token): DjangoClient => new DjangoClient(token);
export default getDjango;

export {};
