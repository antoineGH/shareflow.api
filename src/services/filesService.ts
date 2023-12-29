import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../database";
import {
  MissingFieldError,
  RessourceNotFoundError,
  WrongTypeError,
} from "../utils";
import { groupByFileId, isFileApi } from "./utils";
import type { FileApi } from "../types/files";

// ### getFiles ###
// TODO: implement filter for isDeleted, isFavorite and all by default to display the right files in the right page
async function getFiles(userId: number): Promise<FileApi[]> {
  if (!userId) {
    throw new MissingFieldError("Missing user ID.");
  }
  const [rows] = (await pool.query(
    `
    SELECT files.*, actions.name as actions
    FROM files
    LEFT JOIN files_actions ON files.id = files_actions.file_id
    LEFT JOIN actions ON files_actions.action_id = actions.id
    LEFT JOIN files_data ON files.id = files_data.file_id
    WHERE files_data.user_id = ?
    `,
    [userId]
  )) as unknown as [RowDataPacket[]];

  if (rows.length === 0) {
    throw new RessourceNotFoundError("Files not found.");
  }

  const fileObject = groupByFileId(rows);
  const files: FileApi[] = Object.values(fileObject);

  if (files.some((file) => !isFileApi(file))) {
    throw new WrongTypeError("Data is not of type File");
  }

  return files;
}

// ### getFileById ###
async function getFileById(userId: number, fileId: number): Promise<FileApi> {
  if (!userId || !fileId) {
    throw new MissingFieldError("Missing fields.");
  }

  const [rows] = (await pool.query(
    `
    SELECT files.*, actions.name as actions
    FROM files
    LEFT JOIN files_actions ON files.id = files_actions.file_id
    LEFT JOIN actions ON files_actions.action_id = actions.id
    LEFT JOIN files_data ON files.id = files_data.file_id
    WHERE files_data.user_id = ? AND files.id = ?
    `,
    [userId, fileId]
  )) as unknown as [RowDataPacket[]];

  if (rows.length === 0) {
    throw new RessourceNotFoundError("File not found.");
  }

  const fileObject = groupByFileId(rows);
  const file: FileApi = Object.values(fileObject)[0] as FileApi;

  if (!isFileApi(file)) {
    throw new WrongTypeError("Data is not of type File");
  }

  return file;
}

// ### createFile ###
// TODO: when createFile keep in mind that it is important to create related actions, depending on path (file or folder), isDeleted (page), isFavorite (page)

// ### updateFile ###
// TODO: when updating a file, keep in mind that it is important to update related actions, if following are impacted (file or folder), isDeleted (page), isFavorite (page)

// ### partialUpdateFile ###
// TODO: when partial updating a file, keep in mind that it is important to update related actions, if following are impacted (file or folder), isDeleted (page), isFavorite (page)

// ### deleteFile ###
// TODO: when deleting a file, delete related files_actions associations, comments and files_tags associations

export { getFiles, getFileById };
