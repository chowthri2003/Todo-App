import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let getTokenFn: (() => Promise<string | null>) | null = null;

export const setClerkTokenGetter = (fn: () => Promise<string | null>) => {
  getTokenFn = fn;
};
axiosInstance.interceptors.request.use(async (config) => {
  if (getTokenFn) {
    const token = await getTokenFn();
  console.log("TOKEN SENT:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});
