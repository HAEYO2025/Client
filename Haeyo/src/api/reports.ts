import type { Report, ReportsResponse } from '../types/report';
import type { Post } from '../types/post';
import { getPosts } from './posts';

const toHoursAgo = (createdAt?: string): string => {
  if (!createdAt) {
    return '0시간 전';
  }
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) {
    return '0시간 전';
  }
  const diffMs = Date.now() - created;
  const hours = Math.max(0, Math.floor(diffMs / 3600000));
  return `${hours}시간 전`;
};

const toReport = (post: Post): Report => ({
  id: String(post.id),
  author: {
    name: post.username,
  },
  content: post.description,
  timeAgo: toHoursAgo(post.createdAt),
  stats: {
    likes: 0,
    dislikes: 0,
  },
  location: {
    latitude: post.latitude,
    longitude: post.longitude,
  },
});

/**
 * Fetch recent reports
 * 
 * Mock implementation - replace with actual API call later:
 * 
 * export const fetchRecentReports = async (): Promise<ReportsResponse> => {
 *   const response = await fetch('/api/reports/recent');
 *   const data = await response.json();
 *   return data;
 * };
 */
export const fetchRecentReports = async (): Promise<ReportsResponse> => {
  const posts = await getPosts();
  return {
    success: true,
    data: posts.map(toReport),
  };
};

/**
 * Fetch reports by page (for pagination)
 * 
 * Mock implementation - replace with actual API call later:
 * 
 * export const fetchReportsByPage = async (page: number, limit: number): Promise<ReportsResponse> => {
 *   const response = await fetch(`/api/reports?page=${page}&limit=${limit}`);
 *   const data = await response.json();
 *   return data;
 * };
 */
export const fetchReportsByPage = async (page: number, limit: number = 10): Promise<ReportsResponse> => {
  const posts = await getPosts();
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedReports = posts.slice(startIndex, endIndex).map(toReport);

  return {
    success: true,
    data: paginatedReports,
  };
};

/**
 * Fetch available reports for scenario creation
 * Returns reports that can be used as basis for scenarios
 * 
 * Mock implementation - replace with actual API call later:
 * 
 * export const fetchAvailableReportsForScenario = async (): Promise<ReportsResponse> => {
 *   const response = await fetch('/api/reports/available-for-scenario');
 *   const data = await response.json();
 *   return data;
 * };
 */
export const fetchAvailableReportsForScenario = async (): Promise<ReportsResponse> => {
  const posts = await getPosts();
  return {
    success: true,
    data: posts.map(toReport),
  };
};
