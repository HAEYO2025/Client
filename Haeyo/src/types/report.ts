export interface Report {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  timeAgo: string;
  stats: {
    likes: number;
    comments: number;
  };
}

export interface ReportsResponse {
  success: boolean;
  data: Report[];
  message?: string;
}
