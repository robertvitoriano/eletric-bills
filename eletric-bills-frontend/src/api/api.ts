import axios, { HttpStatusCode } from "axios";
import { env } from "../../env";
export const api = axios.create({
  baseURL: env.VITE_API_URL,
});
const requestIntercepter = (config) => {
  config.headers["X-API-KEY"] = env.VITE_X_API_KEY;
  return config;
};

api.interceptors.request.use(requestIntercepter);
api.interceptors.request.use(requestIntercepter);

api.interceptors.response.use(
  (response) => response,
  (err) => {
    const authorizedUserError =
      err.response &&
      err.response.status !== HttpStatusCode.Forbidden &&
      err.response.status < HttpStatusCode.InternalServerError;
    const unauthorizedUserError = err.response && err.response.status === HttpStatusCode.Forbidden;
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
