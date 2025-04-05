import axios, { AxiosRequestConfig, Method } from "axios";

import Auth from "./Auth";

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
    const config: AxiosRequestConfig & { _retry?: boolean } = {
      url: `${this.baseUrl}${endpoint}`,
      method,
      headers,
    };

    const access = Auth.getAccessToken();

    if (access) {
      config.headers["Authorization"] = `Bearer ${access}`;
    }

    if (method === "GET") {
      config.params = data;
    } else {
      config.data = data;
    }

    return axios(config).catch((error) => {
      const isUnauthorized = error.response?.status === 401;
      const hasRefreshToken = Auth.getRefreshToken();
      const isRetry = config._retry;

      if (isUnauthorized && hasRefreshToken && !isRetry) {
        config._retry = true;

        return axios
          .post(`${this.baseUrl}/token/refresh/`, {
            refresh: hasRefreshToken,
          })
          .then((res) => {
            const newAccess = res.data.access;
            const newRefresh = res.data.access;
            Auth.setTokens(newAccess, newRefresh);
            config.headers["Authorization"] = `Bearer ${newAccess}`;
            return axios(config);
          })
          .catch((refreshError) => {
            Auth.clearTokens();
            window.location.href = "/admin/loginn";
            return Promise.reject(refreshError);
          });
      }

      return Promise.reject(error);
    });
  }
}

export default new Api();
