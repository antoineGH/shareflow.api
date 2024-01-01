type User = {
  user_id: number;
  full_name: string;
  avatar_url: string;
};

export type CommentApi = {
  id: number;
  comment: string;
  created_at: Date;
  updated_at: Date;
  file_id: number;
  user: User;
};
