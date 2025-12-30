import type { 
  ApiResponse,
  LoginFormData, 
  LoginResponse, 
  SignUpFormData, 
  SignUpResponse,
  LogoutResponse,
  RefreshResponse,
  UserProfile
} from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const SIGNUP_URL = `${API_BASE_URL}/api/auth/signup`;
const LOGIN_URL = `${API_BASE_URL}/api/auth/login`;
const REFRESH_URL = `${API_BASE_URL}/api/auth/refresh`;
const LOGOUT_URL = `${API_BASE_URL}/api/auth/logout`;

const parseJson = async (response: Response): Promise<Record<string, unknown>> => {
  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
};

const extractToken = (data: Record<string, unknown>): string | undefined => {
  const token = data.token || data.access_token || data.accessToken;
  return typeof token === 'string' ? token : undefined;
};

const extractUserId = (data: Record<string, unknown>, fallback?: string): string | undefined => {
  const userId = data.userId || data.username || data.email;
  if (typeof userId === 'string' && userId) {
    return userId;
  }
  return fallback;
};

/**
 * Login API
 */
export const login = async (data: LoginFormData): Promise<LoginResponse> => {
  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  const payload = await parseJson(response);

  if (!response.ok || payload.success === false) {
    const message = typeof payload.message === 'string' ? payload.message : '로그인에 실패했습니다.';
    throw new Error(message);
  }

  const token = extractToken(payload);
  const userId = extractUserId(payload, data.username);

  if (token) {
    localStorage.setItem('authToken', token);
  }
  if (userId) {
    localStorage.setItem('userId', userId);
  }
  localStorage.setItem('loginTime', new Date().toISOString());

  await refreshAccessToken();

  return {
    success: true,
    message: typeof payload.message === 'string' ? payload.message : undefined,
    token,
    userId,
  };
};

/**
 * Signup API
 */
export const signUp = async (data: SignUpFormData): Promise<SignUpResponse> => {
  const response = await fetch(SIGNUP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  const payload = await parseJson(response);

  if (!response.ok || payload.success === false) {
    const message = typeof payload.message === 'string' ? payload.message : '회원가입에 실패했습니다.';
    throw new Error(message);
  }

  return {
    success: true,
    message: typeof payload.message === 'string' ? payload.message : undefined,
    userId: extractUserId(payload, data.username),
  };
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const attempt = async (method: 'POST' | 'GET') => {
    const response = await fetch(REFRESH_URL, {
      method,
      credentials: 'include',
    });

    if (!response.ok) {
      return { token: null, status: response.status };
    }

    const headerToken = response.headers.get('Authorization');
    if (headerToken) {
      localStorage.setItem('authToken', headerToken);
      return { token: headerToken, status: response.status };
    }

    const payload = await parseJson(response);
    const token = extractToken(payload);
    if (token) {
      localStorage.setItem('authToken', token);
      return { token, status: response.status };
    }

    return { token: null, status: response.status };
  };

  const postResult = await attempt('POST');
  if (postResult.token || postResult.status !== 405) {
    return postResult.token;
  }

  const getResult = await attempt('GET');
  return getResult.token;
};

export const getAccessToken = (): string | null => localStorage.getItem('authToken');

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAccessToken();
  if (!token) {
    return {};
  }
  const normalized = token.replace(/^Bearer\s+/i, '').trim();
  return { Authorization: `Bearer ${normalized}` };
};

export const fetchWithAuth = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> => {
  const withAuth = {
    ...init,
    headers: {
      ...(init.headers || {}),
      ...getAuthHeaders(),
    },
    credentials: 'include' as RequestCredentials,
  };

  const response = await fetch(input, withAuth);
  if (response.status !== 401) {
    return response;
  }

  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    return response;
  }

  const retry = {
    ...withAuth,
    headers: {
      ...(init.headers || {}),
      ...getAuthHeaders(),
    },
  };

  return fetch(input, retry);
};

/**
 * Real logout API
 */
export const logout = async (): Promise<void> => {
  try {
    await fetch(LOGOUT_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...getAuthHeaders(),
      },
    });
  } catch (error) {
    console.error('Failed to logout:', error);
  } finally {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('loginTime');
  }
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
export const getCurrentUser = (): { userId: string; username: string; userEmail: string; loginTime: string } | null => {
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const userEmail = localStorage.getItem('userEmail');
  const loginTime = localStorage.getItem('loginTime');
  const authToken = localStorage.getItem('authToken');

  // If token exists, we consider user logged in even if some profile fields are missing
  if (authToken) {
    return { 
      userId: userId || '', 
      username: username || userId || '사용자', 
      userEmail: userEmail || '', 
      loginTime: loginTime || '' 
    };
  }

  return null;
};
/**
 * Get current user profile from backend
 */
export const getUserProfile = async (): Promise<ApiResponse<UserProfile>> => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('사용자 정보를 불러올 수 없습니다.');
  }

  return response.json();
};
