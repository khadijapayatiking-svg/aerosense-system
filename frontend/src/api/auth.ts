import type { LoginCredentials, User } from "@/types";

import { api } from "./client";

interface UserResponse {
  user: User;
}

export async function getCsrfCookie(): Promise<void> {
  await api.get("/auth/csrf/");
}

export async function login(credentials: LoginCredentials): Promise<User> {
  await getCsrfCookie();

  const { data } = await api.post<UserResponse>("/auth/login/", credentials);

  return data.user;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout/");
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<UserResponse>("/auth/me/");

  return data.user;
}
