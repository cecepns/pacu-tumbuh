import { get, put } from "@/utils/request";
import { API_ENDPOINTS } from "@/utils/endpoints";

export const settingsService = {
  getSettings: () => get(API_ENDPOINTS.SETTINGS.GET),
  updateSettings: (data) => put(API_ENDPOINTS.SETTINGS.UPDATE, data),
};
