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
  local_url: string;
};

export type Filters = {
  all_files?: number;
  is_favorite?: number;
  is_deleted?: number;
};

export type CreateFolderProps = {
  userId: number;
  name: string;
  is_folder: boolean;
};

export type CreateFileProps = {
  userId: number;
  file: Express.Multer.File | undefined;
};

export type FilesData = {
  files: FileApi[];
  count_files: number;
  count_folders: number;
  total_size: string;
};

export type FileData = {
  file: FileApi;
  count_files: number;
  count_folders: number;
  total_size: string;
};
