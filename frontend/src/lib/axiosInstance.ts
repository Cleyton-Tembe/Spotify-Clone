import axios from "axios";
import { getToken } from "@clerk/react";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api",
  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
  try {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (error) {
    console.log("Couldn't get Clerk token", error);
  }
  return config;
});

export default axiosInstance;
