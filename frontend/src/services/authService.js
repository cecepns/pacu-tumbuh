import { post, get } from "@/utils/request";
import { API_ENDPOINTS } from "@/utils/endpoints";

export const authService = {
  login: async (credentials) => {
    return await post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },
  getProfile: async () => {
    return await get(API_ENDPOINTS.AUTH.PROFILE);
  },
};
