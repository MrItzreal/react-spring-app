import axios, { type AxiosRequestConfig } from "axios";
import { useAuth } from "@clerk/clerk-react";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const useApiClient = () => {
  const { getToken } = useAuth();

  const makeAuthenticatedRequest = async (config: AxiosRequestConfig) => {
    const token = await getToken({ template: "spring-boot-template" });
    return apiClient({
      ...config,
      headers: {
        ...config.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  };

  return { makeAuthenticatedRequest };
};

