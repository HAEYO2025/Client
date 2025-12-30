export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
  stats: {
    reportsCount: number;
    scenariosCount: number;
  };
}

export interface UserReport {
  id: string;
  content: string;
  location: string;
  createdAt: string;
  stats: {
    likes: number;
    comments: number;
  };
}

export interface UserScenario {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  survivalRate: number;
  status: 'completed' | 'in_progress';
}

export interface ProfileData {
  profile: UserProfile;
  recentReports: UserReport[];
  recentScenarios: UserScenario[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
