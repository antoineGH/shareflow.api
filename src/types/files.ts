export type FileApi = {
  id: number;
  name: string;
  size: string;
  path: string;
  is_favorite: number;
  is_deleted: number;
  is_folder: number;
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
  is_folder: boolean;
  is_favorite: boolean;
  is_deleted: boolean;
};

export type FilesData = {
  files: FileApi[];
  count_files: number;
  count_folders: number;
  total_size: string;
};
