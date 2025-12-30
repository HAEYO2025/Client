import type { ProfileData, UserProfile, UserReport, UserScenario, ApiResponse } from '../types/profile';

// Mock data
const mockProfile: UserProfile = {
  id: 'user-1',
  name: '김해요',
  email: 'haeyo@example.com',
  avatar: '👤',
  joinDate: '2024-01-15',
  stats: {
    reportsCount: 12,
    scenariosCount: 8,
  },
};

const mockReports: UserReport[] = [
  {
    id: 'report-1',
    content: '해변에서 쓰레기 무단 투기 발견했습니다.',
    location: '부산 해운대',
    createdAt: '2024-03-15T10:30:00Z',
    stats: {
      likes: 24,
      comments: 5,
    },
  },
  {
    id: 'report-2',
    content: '해파리 대량 발견했습니다. 주의 필요합니다.',
    location: '제주 협재해수욕장',
    createdAt: '2024-03-14T14:20:00Z',
    stats: {
      likes: 18,
      comments: 3,
    },
  },
  {
    id: 'report-3',
    content: '안전 표지판이 파손되어 있습니다.',
    location: '강릉 경포해변',
    createdAt: '2024-03-13T09:15:00Z',
    stats: {
      likes: 15,
      comments: 2,
    },
  },
];

const mockScenarios: UserScenario[] = [
  {
    id: 'scenario-1',
    title: '해파리 출몰 시 대처법',
    description: '해수욕 중 해파리를 발견했을 때의 대응 시나리오',
    createdAt: '2024-03-15T16:45:00Z',
    survivalRate: 85,
    status: 'completed',
  },
  {
    id: 'scenario-2',
    title: '급격한 날씨 변화 대응',
    description: '해상에서 갑작스러운 폭풍우 상황 대처',
    createdAt: '2024-03-14T11:30:00Z',
    survivalRate: 72,
    status: 'completed',
  },
  {
    id: 'scenario-3',
    title: '조난 상황 대응 훈련',
    description: '바다에서 조난 당했을 때의 생존 시나리오',
    createdAt: '2024-03-12T15:20:00Z',
    survivalRate: 68,
    status: 'completed',
  },
];

// Mock API functions
export const fetchProfileData = async (): Promise<ApiResponse<ProfileData>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    success: true,
    data: {
      profile: mockProfile,
      recentReports: mockReports,
      recentScenarios: mockScenarios,
    },
  };
};

export const fetchUserReports = async (): Promise<ApiResponse<UserReport[]>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    success: true,
    data: mockReports,
  };
};

export const fetchUserScenarios = async (): Promise<ApiResponse<UserScenario[]>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    success: true,
    data: mockScenarios,
  };
};
