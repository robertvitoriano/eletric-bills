import axios from "axios";
import { env } from "../../env";
export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (err) => {
    if (err.response.status < 500) {
      localStorage.clear();
      location.reload();
      return Promise.reject(null);
    }
  }
);
