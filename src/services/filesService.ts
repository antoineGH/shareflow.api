import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../database";
import {
  MissingFieldError,
  RessourceNotFoundError,
  WrongTypeError,
} from "../utils";
import { groupByFileId, isFileApi } from "./utils";
import type { FileApi, Filters } from "../types/files";

// ### getFiles ###

// TODO: implement filter for isDeleted, isFavorite and all by default to display Non Deleted and Favotite and Non Favorite / filter all files with tags
async function getFiles(
  userId: number,
  filters: Filters = {},
  tagNames: string[] = []
): Promise<FileApi[]> {
  if (!userId) {
    throw new MissingFieldError("Missing user ID.");
  }

  let query = `
    SELECT files.*, actions.name as actions
    FROM files
    LEFT JOIN files_actions ON files.id = files_actions.file_id
    LEFT JOIN actions ON files_actions.action_id = actions.id
    LEFT JOIN files_data ON files.id = files_data.file_id
    LEFT JOIN files_tags ON files.id = files_tags.files_id
    LEFT JOIN tags ON files_tags.tags_id = tags.id
    WHERE files_data.user_id = ?
  `;

  const values: (number | string[])[] = [userId];

  if (filters.all_files !== undefined) {
    query += " AND files.is_deleted = ?";
    values.push(filters.all_files ? 0 : 1);
  }

  if (filters.is_favorite !== undefined) {
    query += " AND files.is_favorite = ?";
    values.push(filters.is_favorite ? 1 : 0);
  }

  if (filters.is_deleted !== undefined) {
    query += " AND files.is_deleted = ?";
    values.push(filters.is_deleted ? 1 : 0);
  }

  if (tagNames.length > 0) {
    query += " AND tags.tag IN (?)";
    values.push(tagNames);
  }

  const [rows] = (await pool.query(query, values)) as unknown as [
    RowDataPacket[]
  ];

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
// TODO: when createFile keep in mind that it is important to create related actions, depending on path (file or folder), isDeleted (page), isFavorite (page), and create related activites

// ### updateFile ###
// TODO: when updating a file, keep in mind that it is important to update related actions, if following are impacted (file or folder), isDeleted (page), isFavorite (page) and create related activities

// ### partialUpdateFile ###
// TODO: when partial updating a file, keep in mind that it is important to update related actions, if following are impacted (file or folder), isDeleted (page), isFavorite (page) and create related activities
// TODO: patch would be responsible for toggling favorite {star action }
// TODO: patch would be responsible for toggling deleted (restore action)

// ### deleteFile ###
async function deleteFile(userId: number, fileId: number): Promise<void> {
  if (!userId || !fileId) {
    throw new MissingFieldError("Missing fields.");
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query("DELETE FROM files_actions WHERE file_id = ?", [
      fileId,
    ]);

    await connection.query("DELETE FROM files_tags WHERE files_id = ?", [
      fileId,
    ]);

    await connection.query("DELETE FROM activities WHERE file_id = ?", [
      fileId,
    ]);

    const [rows] = (await connection.query(
      "DELETE FROM files WHERE id = ? AND user_id = ?",
      [fileId, userId]
    )) as unknown as [ResultSetHeader];

    if (rows.affectedRows === 0) {
      throw new RessourceNotFoundError("File not found.");
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export { getFiles, getFileById, deleteFile };
