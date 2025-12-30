export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  errorCode: string;
  message: string;
  timestamp: string;
}

export interface SignUpFormData {
  username: string;
  email: string;
  password: string;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  userId: string;
  email: string;
}

export type LoginResponse = ApiResponse<LoginResponseData>;
export type SignUpResponse = ApiResponse<null>;
export type LogoutResponse = ApiResponse<null>;
export type RefreshResponse = ApiResponse<null>;
