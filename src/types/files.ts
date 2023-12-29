export type FileApi = {
  id: number;
  name: string;
  size: string;
  path: string;
  is_favorite: number;
  is_deleted: number;
  created_at: Date;
  updated_at: Date;
  actions: string[];
};
