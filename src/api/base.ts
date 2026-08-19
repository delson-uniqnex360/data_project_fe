import axios from "axios";

export const API_V1 = "/api/v1/";

export const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_BASE_URL,
});
