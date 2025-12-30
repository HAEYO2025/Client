import type { 
  LoginFormData, 
  LoginResponse, 
  SignUpFormData, 
  SignUpResponse,
  LogoutResponse,
  RefreshResponse
} from '../types/auth';

const API_BASE_URL = ''; // Base URL is empty to use relative paths (proxy configuration recommended)

const getHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

/**
 * Real login API
 */
export const login = async (data: LoginFormData): Promise<LoginResponse> => {
  console.log('Attempting login with:', JSON.stringify(data));
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = '로그인에 실패했습니다.';
    try {
      const errorData = await response.json();
      console.error('Login error response:', errorData);
      errorMessage = errorData.message || errorMessage;
    } catch {
      console.error('Login failed with status:', response.status);
    }
    throw new Error(errorMessage);
  }

  const result: LoginResponse = await response.json();
  console.log('Login successful:', result);

  if (result.success && result.data) {
    localStorage.setItem('authToken', result.data.token);
    localStorage.setItem('userId', String(result.data.userId));
    localStorage.setItem('userEmail', result.data.email);
    localStorage.setItem('loginTime', new Date().toISOString());
  }
  return result;
};

/**
 * Real signup API
 */
export const signUp = async (data: SignUpFormData): Promise<SignUpResponse> => {
  console.log('Attempting signup with:', JSON.stringify(data));
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = '회원가입에 실패했습니다.';
    try {
      const errorData = await response.json();
      console.error('Signup error response:', errorData);
      errorMessage = errorData.message || errorMessage;
    } catch {
      console.error('Signup failed with status:', response.status);
    }
    throw new Error(errorMessage);
  }

  const result: SignUpResponse = await response.json();
  console.log('Signup successful:', result);
  return result;
};

/**
 * Real logout API
 */
export const logout = async (): Promise<LogoutResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: getHeaders(),
  });

  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('loginTime');

  if (!response.ok) {
    console.warn('Backend logout failed, but local session cleared.');
  }

  return response.json();
};

/**
 * Real refresh API
 */
export const refresh = async (): Promise<RefreshResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: getHeaders(),
  });

  const result: RefreshResponse = await response.json();
  return result;
};

/**
 * Check if user is logged in
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('authToken');
};

/**
 * Get current user info from localStorage
 */
export const getCurrentUser = (): { userId: string; userEmail: string; loginTime: string } | null => {
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');
  const loginTime = localStorage.getItem('loginTime');

  if (userId && userEmail && loginTime) {
    return { userId, userEmail, loginTime };
  }

  return null;
};
