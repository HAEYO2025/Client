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

const API_BASE_URL = ''; // Base URL is empty to use relative paths (proxy configuration recommended)

const getHeaders = () => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    console.warn('No authToken found in localStorage');
  } else {
    console.log('Token found, length:', token.length);
  }

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
  console.log('Login successful response body:', result);

  if (result.success) {
    // 🔍 DEBUG: Log ALL response headers
    console.log('--- Response Headers ---');
    response.headers.forEach((value, name) => {
      console.log(`${name}: ${value}`);
    });
    console.log('------------------------');

    // 1. Try to get token from header first (Case-insensitive get)
    const authHeader = response.headers.get('Authorization') || response.headers.get('authorization');
    let token = '';
    if (authHeader) {
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log('✅ Token extracted from Header (with Bearer)');
      } else {
        token = authHeader;
        console.log('✅ Token extracted from Header (plain)');
      }
    } else if (result.data?.accessToken) {
      // 2. Fallback to body data
      token = result.data.accessToken;
      console.log('✅ Token extracted from Body');
    }

    if (token) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', data.username); // Initial fallback
      localStorage.setItem('loginTime', new Date().toISOString());

      // 3. Fetch full profile (id, email, etc.) using the new token
      try {
        const profileResponse = await getUserProfile();
        if (profileResponse.success && profileResponse.data) {
          const profile = profileResponse.data;
          localStorage.setItem('userId', String(profile.id));
          if (profile.username) {
            localStorage.setItem('username', profile.username);
          }
          localStorage.setItem('userEmail', profile.email);
          console.log('User profile loaded and saved:', profile);
        }
      } catch (profileError) {
        console.warn('Failed to fetch user profile after login:', profileError);
      }
    } else {
      console.error('No token found in either header or body!');
    }
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
