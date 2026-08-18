import { get, post, put, del } from "@/utils/request";
import { API_ENDPOINTS } from "@/utils/endpoints";

export const childProfileService = {
  list: (params) => get(API_ENDPOINTS.CHILD_PROFILES.LIST, params),
  detail: (id) => get(API_ENDPOINTS.CHILD_PROFILES.DETAIL(id)),
  create: (data) => post(API_ENDPOINTS.CHILD_PROFILES.CREATE, data),
  update: (id, data) => put(API_ENDPOINTS.CHILD_PROFILES.UPDATE(id), data),
  delete: (id) => del(API_ENDPOINTS.CHILD_PROFILES.DELETE(id)),
};

export const screeningService = {
  // Communication
  listCommunication: (params) => get(API_ENDPOINTS.SCREENING.COMMUNICATION.LIST, params),
  createCommunication: (data) => post(API_ENDPOINTS.SCREENING.COMMUNICATION.CREATE, data),

  // Motor
  listMotor: (params) => get(API_ENDPOINTS.SCREENING.MOTOR.LIST, params),
  createMotor: (data) => post(API_ENDPOINTS.SCREENING.MOTOR.CREATE, data),

  // Nutrition
  listNutrition: (params) => get(API_ENDPOINTS.SCREENING.NUTRITION.LIST, params),
  createNutrition: (data) => post(API_ENDPOINTS.SCREENING.NUTRITION.CREATE, data),

  // Evaluation
  createEvaluation: (data) => post(API_ENDPOINTS.EVALUATIONS.CREATE, data),
  getEvaluationByChild: (childId) => get(API_ENDPOINTS.EVALUATIONS.BY_CHILD(childId)),

  // Dashboard stats
  getDashboardStats: () => get(API_ENDPOINTS.DASHBOARD.STATS),
};
