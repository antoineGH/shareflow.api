import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../database";
import {
  AlreadyExists,
  MissingFieldError,
  RessourceNotFoundError,
  WrongTypeError,
} from "../utils";
import { getActionIds, groupByFileId, isFileApi } from "./utils";
import type {
  CreateFileProps,
  FileApi,
  FilesData,
  Filters,
} from "../types/files";

// ### getFiles ###
async function getFiles(
  userId: number,
  filters: Filters = {},
  tagNames: string[] = []
): Promise<FilesData | {}> {
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
    return {};
  }

  const fileObject = groupByFileId(rows);
  const files: FileApi[] = Object.values(fileObject);

  if (files.some((file) => !isFileApi(file))) {
    throw new WrongTypeError("Data is not of type File");
  }

  const filesData: FilesData = {
    files,
    count_files: files.filter((file) => file.is_folder === 0).length,
    count_folders: files.filter((file) => file.is_folder === 1).length,
    total_size: files
      .filter((file) => file.is_folder === 0)
      .reduce((acc, file) => acc + parseInt(file.size), 0)
      .toString(),
  };

  return filesData;
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
async function createFile({
  userId,
  name,
  size,
  path,
  is_folder,
  is_favorite,
  is_deleted,
}: CreateFileProps): Promise<FileApi> {
  if (!userId || !name || !size || !path) {
    throw new MissingFieldError("Missing fields.");
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existingFiles] = (await connection.query(
      "SELECT * FROM files INNER JOIN files_data ON files.id = files_data.file_id WHERE files_data.user_id = ? AND files.path = ?",
      [userId, path]
    )) as unknown as [RowDataPacket[]];

    if (existingFiles.length > 0) {
      throw new AlreadyExists("Path already exists for this user.");
    }

    // ## insert entry in file table ##
    const [rows] = (await connection.query(
      "INSERT INTO files (name, size, path, is_folder, is_favorite, is_deleted) VALUES (?, ?, ?, ?, ?, ?)",
      [
        name,
        size,
        path,
        is_folder ? 1 : 0,
        is_favorite ? 1 : 0,
        is_deleted ? 1 : 0,
      ]
    )) as unknown as [ResultSetHeader];

    const fileId = rows.insertId;

    await connection.query(
      "INSERT INTO files_data (user_id, file_id) VALUES (?, ?)",
      [userId, fileId]
    );

    // ## insert entry in files_actions table ##
    const actionIds = getActionIds(is_folder, is_deleted);
    console.log(actionIds);

    for (const actionId of actionIds) {
      await connection.query(
        "INSERT INTO files_actions (file_id, action_id) VALUES (?, ?)",
        [fileId, actionId]
      );
    }

    // ## insert entry in activities table ##
    const activityDescription = `${name} has been created.`;
    await connection.query(
      "INSERT INTO activities (activity, file_id, user_id) VALUES (?, ?, ?)",
      [activityDescription, fileId, userId]
    );

    await connection.commit();

    const newFile: FileApi = await getFileById(userId, fileId);

    if (!isFileApi(newFile)) {
      throw new WrongTypeError("Data is not of type File");
    }
    return newFile;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// ### updateFile ###
async function updateFile(
  userId: number,
  fileId: number,
  update: Omit<FileApi, "id" | "created_at" | "updated_at" | "actions">
): Promise<FileApi> {
  if (!userId || !fileId || !update) {
    throw new MissingFieldError("Missing fields.");
  }
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const [rows] = (await connection.query("UPDATE files SET ? WHERE id = ?", [
      update,
      fileId,
    ])) as unknown as [ResultSetHeader];

    if (rows.affectedRows === 0) {
      throw new RessourceNotFoundError("File not found.");
    }

    // ## update files_actions ##
    const actionIds = getActionIds(!!update.is_folder, !!update.is_deleted);

    await connection.query("DELETE FROM files_actions WHERE file_id = ?", [
      fileId,
    ]);

    for (const actionId of actionIds) {
      await connection.query(
        "INSERT INTO files_actions (file_id, action_id) VALUES (?, ?)",
        [fileId, actionId]
      );
    }

    // ## update activity ##
    const patchFile: FileApi = await getFileById(userId, fileId);
    const { name } = patchFile;
    const activityDescription = `${name} has been updated.`;
    await connection.query(
      "INSERT INTO activities (activity, file_id, user_id) VALUES (?, ?, ?)",
      [activityDescription, fileId, userId]
    );

    await connection.commit();

    const updatedFile: FileApi = await getFileById(userId, fileId);

    if (!updatedFile) {
      throw new RessourceNotFoundError("File not found.");
    }

    if (!isFileApi(updatedFile)) {
      throw new WrongTypeError("Data is not of type File");
    }

    return updatedFile;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// ### partialUpdateFile ###
async function patchFile(
  userId: number,
  fileId: number,
  update: Partial<FileApi>
): Promise<FileApi> {
  if (!userId || !fileId || !update) {
    throw new MissingFieldError("Missing fields.");
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const keys = Object.keys(update).filter((key) => update[key] !== undefined);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = keys.map((key) => update[key]);

    const [rows] = (await connection.query(
      `UPDATE files 
      INNER JOIN files_data ON files.id = files_data.file_id 
      SET ${setClause} 
      WHERE files.id = ? AND files_data.user_id = ?`,
      [...values, fileId, userId]
    )) as unknown as [ResultSetHeader];

    if (rows.affectedRows === 0) {
      throw new RessourceNotFoundError("File not found.");
    }

    // ## update files_actions ##
    if (keys.includes("is_deleted")) {
      const actionIds = getActionIds(!!update.is_folder, !!update.is_deleted);

      await connection.query("DELETE FROM files_actions WHERE file_id = ?", [
        fileId,
      ]);

      for (const actionId of actionIds) {
        await connection.query(
          "INSERT INTO files_actions (file_id, action_id) VALUES (?, ?)",
          [fileId, actionId]
        );
      }
    }

    // ## update activity ##
    const patchFile: FileApi = await getFileById(userId, fileId);
    const { name } = patchFile;
    let activityDescription = `${name} has been updated.`;
    await connection.query(
      "INSERT INTO activities (activity, file_id, user_id) VALUES (?, ?, ?)",
      [activityDescription, fileId, userId]
    );

    await connection.commit();

    const patchedFile: FileApi = await getFileById(userId, fileId);

    if (!patchedFile) {
      throw new RessourceNotFoundError("File not found.");
    }

    if (!isFileApi(patchedFile)) {
      throw new WrongTypeError("Data is not of type File");
    }

    return patchedFile;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

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

    await connection.query("DELETE FROM comments WHERE file_id = ?", [fileId]);

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

export { getFiles, getFileById, createFile, updateFile, patchFile, deleteFile };
