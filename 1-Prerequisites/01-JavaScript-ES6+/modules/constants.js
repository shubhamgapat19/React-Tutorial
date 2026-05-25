// ========================================
// CONSTANTS MODULE
// ========================================

// API Configuration
export const API_BASE_URL = "https://api.example.com";
export const API_TIMEOUT = 5000;
export const API_VERSION = "v1";

// App Configuration
export const APP_NAME = "Smart Freight";
export const APP_VERSION = "1.0.0";

// Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

// Colors (for UI)
export const COLORS = {
  PRIMARY: "#007bff",
  SUCCESS: "#28a745",
  DANGER: "#dc3545",
  WARNING: "#ffc107",
  INFO: "#17a2b8"
};

// Routes
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  LOGIN: "/login"
};

// Export all at once
const ENV = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production"
};

export { ENV };

console.log("constants.js loaded");
