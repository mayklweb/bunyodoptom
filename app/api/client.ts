import axios from "axios";
import { setupInterceptors } from "./interceptors";

const BASE_URL = "https://api.bunyodoptom.uz/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

setupInterceptors(api);

export default api;
