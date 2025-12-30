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
    feedbackData: {
      feedbackEntries: [
        {
          situation: '해수욕장에서 해파리를 발견했습니다.',
          choice: '즉시 물에서 나와 안전요원에게 알린다.',
          feedback: {
            evaluation: 'SAFE',
            survival_impact: '생존율 +15%',
            comment: '올바른 대처입니다. 해파리를 발견하면 즉시 물에서 나와 주변 사람들에게 알리는 것이 중요합니다.',
          },
        },
        {
          situation: '해파리에 쏘인 사람을 발견했습니다.',
          choice: '119에 신고하고 응급처치를 한다.',
          feedback: {
            evaluation: 'SAFE',
            survival_impact: '생존율 +10%',
            comment: '신속한 대응이 중요합니다. 해파리에 쏘이면 즉시 119에 신고하고 응급처치를 해야 합니다.',
          },
        },
      ],
      survivalRate: {
        survival_rate: 85,
        change: '+25%',
      },
    },
  },
  {
    id: 'scenario-2',
    title: '급격한 날씨 변화 대응',
    description: '해상에서 갑작스러운 폭풍우 상황 대처',
    createdAt: '2024-03-14T11:30:00Z',
    survivalRate: 72,
    status: 'completed',
    feedbackData: {
      feedbackEntries: [
        {
          situation: '갑자기 날씨가 나빠지고 파도가 높아졌습니다.',
          choice: '해안 쪽으로 신속히 이동한다.',
          feedback: {
            evaluation: 'SAFE',
            survival_impact: '생존율 +20%',
            comment: '올바른 판단입니다. 날씨가 나빠지면 즉시 안전한 곳으로 이동해야 합니다.',
          },
        },
        {
          situation: '파도에 휩쓸릴 위험이 있습니다.',
          choice: '구명조끼를 착용하고 도움을 요청한다.',
          feedback: {
            evaluation: 'CAUTION',
            survival_impact: '생존율 +5%',
            comment: '구명조끼는 좋은 선택이지만, 더 빨리 안전한 곳으로 이동했어야 합니다.',
            better_choice: '파도가 높아지기 전에 미리 해안으로 이동하기',
          },
        },
      ],
      survivalRate: {
        survival_rate: 72,
        change: '+25%',
      },
    },
  },
  {
    id: 'scenario-3',
    title: '조난 상황 대응 훈련',
    description: '바다에서 조난 당했을 때의 생존 시나리오',
    createdAt: '2024-03-12T15:20:00Z',
    survivalRate: 68,
    status: 'completed',
    feedbackData: {
      feedbackEntries: [
        {
          situation: '보트가 고장나서 표류하고 있습니다.',
          choice: '신호탄을 쏘고 구조 신호를 보낸다.',
          feedback: {
            evaluation: 'SAFE',
            survival_impact: '생존율 +15%',
            comment: '신속한 구조 요청이 생존의 핵심입니다.',
          },
        },
        {
          situation: '물과 식량이 부족합니다.',
          choice: '물과 식량을 아껴 사용한다.',
          feedback: {
            evaluation: 'DANGER',
            survival_impact: '생존율 -10%',
            comment: '비상식량을 미리 준비했어야 합니다.',
            better_choice: '출발 전 충분한 비상식량과 물 준비하기',
          },
        },
      ],
      survivalRate: {
        survival_rate: 68,
        change: '+5%',
      },
    },
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
