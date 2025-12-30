export type PostCategory = 'TRASH' | 'DAMAGE' | 'ANIMAL' | 'OTHER';

export interface Post {
  id: number;
  username: string;
  latitude: number;
  longitude: number;
  category: PostCategory;
  description: string;
  imageUrl: string;
  address: string;
  createdAt: string;
  resolved: boolean;
}

export interface CreatePostRequest {
  latitude: number;
  longitude: number;
  category: PostCategory;
  description: string;
  imageBase64: string;
  address: string;
}

export interface ApiError {
  error: string;
  requireLogin?: boolean;
}
export interface CheckAuthResponse {
  authenticated: boolean;
  username?: string;
}
