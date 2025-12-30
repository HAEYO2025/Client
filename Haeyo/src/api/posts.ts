import type { Post, CreatePostRequest, PostCategory } from '../types/post';
import { fetchWithAuth, getAuthHeaders } from './auth';

const API_BASE_URL = '';

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
  };
};

export const createPost = async (data: CreatePostRequest): Promise<Post> => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');
  }

  console.log('Attempting to create post with data:', JSON.stringify(data));
  const response = await fetchWithAuth(`${API_BASE_URL}/api/posts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = '게시물 생성에 실패했습니다.';
    try {
      const errorData = await response.json();
      console.error('Create post error response:', errorData);
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      console.error('Create post failed with status:', response.status);
    }
    throw new Error(errorMessage);
  }

  const result = await response.json();
  console.log('Post created successfully:', result);
  return result;
};

export const getPosts = async (): Promise<Post[]> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/posts`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '게시물 조회에 실패했습니다.');
  }

  return response.json();
};

export const getPostById = async (id: number | string): Promise<Post> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/posts/${id}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '게시물 상세 조회에 실패했습니다.');
  }

  return response.json();
};

export const getPostsByBounds = async (_bounds: unknown): Promise<Post[]> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/posts`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '영역 내 게시물 조회에 실패했습니다.');
  }

  return response.json();
};

export const getPostsByCategory = async (category: PostCategory): Promise<Post[]> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/posts/category/${category}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '카테고리별 게시물 조회에 실패했습니다.');
  }

  return response.json();
};

export const toggleResolvePost = async (id: number | string): Promise<Post> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/posts/${id}/resolve`, {
    method: 'PATCH',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '게시물 해결 상태 변경에 실패했습니다.');
  }

  return response.json();
};

export const deletePost = async (id: number | string): Promise<{ message: string }> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/posts/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '게시물 삭제에 실패했습니다.');
  }

  return response.json();
};

export const checkAuth = async (): Promise<{ authenticated: boolean; username?: string }> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/posts/check-auth`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    return { authenticated: false };
  }

  return response.json();
};
