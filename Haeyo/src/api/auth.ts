import type { LoginFormData, LoginResponse, SignUpFormData, SignUpResponse } from '../types/auth';

// Mock delay to simulate network request
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock credentials
const MOCK_CREDENTIALS = {
  username: 'root',
  password: '1234',
};

/**
 * Mock login API
 * Credentials: username: root, password: 1234
 */
export const login = async (data: LoginFormData): Promise<LoginResponse> => {
  await mockDelay(500); // Simulate network delay

  if (data.username === MOCK_CREDENTIALS.username && data.password === MOCK_CREDENTIALS.password) {
    const mockToken = 'mock-jwt-token-' + Date.now();
    const response: LoginResponse = {
      success: true,
      message: '로그인 성공',
      token: mockToken,
      userId: data.username,
    };

    // Store in localStorage
    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('userId', data.username);
    localStorage.setItem('loginTime', new Date().toISOString());

    return response;
  } else {
    throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
  }
};

/**
 * Mock signup API
 */
export const signUp = async (data: SignUpFormData): Promise<SignUpResponse> => {
  await mockDelay(500);

  // For now, just simulate success
  const response: SignUpResponse = {
    success: true,
    message: '회원가입 성공',
    userId: data.username,
  };

  return response;
};

/**
 * Logout - clear localStorage
 */
export const logout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('loginTime');
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
export const getCurrentUser = (): { userId: string; loginTime: string } | null => {
  const userId = localStorage.getItem('userId');
  const loginTime = localStorage.getItem('loginTime');

  if (userId && loginTime) {
    return { userId, loginTime };
  }

  return null;
};
