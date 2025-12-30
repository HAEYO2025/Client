import type { Report, ReportsResponse } from '../types/report';

// Mock delay to simulate network request
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock reports data
const MOCK_REPORTS: Report[] = [
  {
    id: '1',
    author: {
      name: '박가은',
      avatar: '👤',
    },
    content: '쓰레기 무단 투기하는 사람이 너무 많네요.',
    timeAgo: '2시간 전',
    stats: {
      likes: 12,
      comments: 12,
    },
    location: {
      latitude: 37.5665,
      longitude: 126.978,
    },
  },
  {
    id: '2',
    author: {
      name: '김동욱',
      avatar: '👤',
    },
    content: '해파리 발견했습니다.',
    timeAgo: '4시간 전',
    stats: {
      likes: 8,
      comments: 12,
    },
    location: {
      latitude: 37.4562,
      longitude: 126.7052,
    },
  },
  {
    id: '3',
    author: {
      name: '류승찬',
      avatar: '👤',
    },
    content: '상어 발견했습니다.',
    timeAgo: '6시간 전',
    stats: {
      likes: 2,
      comments: 12,
    },
    location: {
      latitude: 37.3905,
      longitude: 126.6356,
    },
  },
  {
    id: '4',
    author: {
      name: '김동욱',
      avatar: '👤',
    },
    content: '대왕고래 발견했습니다.',
    timeAgo: '8시간 전',
    stats: {
      likes: 8,
      comments: 12,
    },
    location: {
      latitude: 37.4481,
      longitude: 126.3820,
    },
  },
];

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
  await mockDelay(300); // Simulate network delay

  return {
    success: true,
    data: MOCK_REPORTS,
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
  await mockDelay(300);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedReports = MOCK_REPORTS.slice(startIndex, endIndex);

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
  await mockDelay(300);

  // Mock: Return all reports as available for scenarios
  // In real implementation, this might filter by certain criteria
  return {
    success: true,
    data: MOCK_REPORTS,
  };
};
