// src/auth/types.ts
export type Roles = "GUEST" | "HOST" | "ADMIN";

export interface UserInfo {
  id: number;
  username: string;
  nickname?: string;
  email?: string;
  role?: Roles;
  roles: Roles[];
  address?: string;
  phoneNumber?: string;
  lifeStyle?: string;
  signupDate?: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface SignupPayload {
  username: string;
  password: string;
  nickname: string;
  address: string;
  phoneNumber: string;
  lifeStyle: string;
  role: Roles;
}

export interface UpdateProfilePayload {
  nickname?: string;
  address?: string;
  phoneNumber?: string;
  lifeStyle?: string;
}

export interface ApiEnvelope<T> {
  code: number;
  message: string;
  result: T;
  timestamp?: string;
}
