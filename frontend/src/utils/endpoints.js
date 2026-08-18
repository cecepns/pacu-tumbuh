export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PROFILE: "/auth/profile",
  },
  CHILD_PROFILES: {
    LIST: "/child-profiles",
    DETAIL: (id) => `/child-profiles/${id}`,
    CREATE: "/child-profiles",
    UPDATE: (id) => `/child-profiles/${id}`,
    DELETE: (id) => `/child-profiles/${id}`,
  },
  SCREENING: {
    COMMUNICATION: {
      LIST: "/screening-communication",
      CREATE: "/screening-communication",
    },
    MOTOR: {
      LIST: "/screening-motor",
      CREATE: "/screening-motor",
    },
    NUTRITION: {
      LIST: "/screening-nutrition",
      CREATE: "/screening-nutrition",
    },
  },
  EVALUATIONS: {
    CREATE: "/evaluations",
    BY_CHILD: (childId) => `/evaluations/child/${childId}`,
  },
  SETTINGS: {
    GET: "/settings",
    UPDATE: "/settings",
  },
  DASHBOARD: {
    STATS: "/dashboard/stats",
  },
};
