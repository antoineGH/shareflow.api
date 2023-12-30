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

export type Filters = {
  all_files?: number;
  is_favorite?: number;
  is_deleted?: number;
};

export type CreateFileProps = {
  userId: number;
  name: string;
  size: string;
  path: string;
  isFolder: boolean;
  isFavorite: boolean;
  isDeleted: boolean;
};
