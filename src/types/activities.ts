export type ActivityApi = {
  id: number;
  user: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  file_id: number;
  activity: string;
  created_at: string;
  updated_at: string;
};
