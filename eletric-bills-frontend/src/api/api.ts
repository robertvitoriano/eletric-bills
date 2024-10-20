import axios from "axios";
import { env } from "../../env";
export const api = axios.create({
  baseURL: env.VITE_API_URL,
});
const requestIntercepter = (config) => {
  config.headers["X-API-KEY"] = env.X_API_KEY;
  return config;
};

api.interceptors.request.use(requestIntercepter);
api.interceptors.request.use(requestIntercepter);

api.interceptors.response.use(
  (response) => response,
  (err) => {
    const authorizedUserError = err.response && err.response.status !== 401 && err.response.status < 500;
    const unauthorizedUserError = err.response && err.response.status === 401;
    if (unauthorizedUserError) {
      localStorage.clear();
      location.reload();
      return Promise.reject(null);
    }

    if (authorizedUserError) {
      console.error(err);
      return Promise.reject(err);
    }
  }
);
