import axios, { AxiosRequestConfig, Method } from "axios";

class Api {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.API_BASE_URL || "http://localhost:8000/api";
  }

  fetch(
    endpoint: string,
    data: any = {},
    method: Method = "GET",
    headers: Record<string, string> = {}
  ) {
    const config: AxiosRequestConfig = {
      url: `${this.baseUrl}${endpoint}`,
      method,
      headers,
    };

    if (method === "GET") {
      config.params = data;
    } else {
      config.data = data;
    }

    return axios(config);
  }
}

export default new Api();
