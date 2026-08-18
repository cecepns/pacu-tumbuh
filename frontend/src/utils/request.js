import { api } from "./api";

/**
 * Reusable request helper with normalized error handling
 */
export async function request(method, url, data = null, params = null) {
  try {
    const response = await api({
      method,
      url,
      data,
      params,
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Terjadi kesalahan saat memproses permintaan";
    throw new Error(message);
  }
}

export const get = (url, params) => request("GET", url, null, params);
export const post = (url, data) => request("POST", url, data);
export const put = (url, data) => request("PUT", url, data);
export const del = (url) => request("DELETE", url);
