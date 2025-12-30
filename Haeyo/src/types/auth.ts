export interface SignUpFormData {
  email: string;
  username: string;
  password: string;
}

export interface SignUpResponse {
  success: boolean;
  message?: string;
  userId?: string;
}
