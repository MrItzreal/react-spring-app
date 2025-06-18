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

/*
This code snippet will go on the Todos component once is ready
const { isLoaded, isSignedIn, userId } = useAuth()

// Use userId to fetch user's todos
const fetchUserTodos = async () => {
  if (!userId) return
  
  const response = await fetch(`/api/todos?userId=${userId}`)
  return response.json()
}

*/
