import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../database";
import path from "path";
import archiver from "archiver";
import fs, { unlink } from "fs";
import {
  AlreadyExists,
  MissingFieldError,
  RessourceNotFoundError,
  WrongTypeError,
} from "../utils";
import {
  getActionIds,
  getFilePath,
  getSizeFile,
  groupByFileId,
  isBreadcrumbApi,
  isFileApi,
} from "./utils";
import type {
  CreateFileProps,
  CreateFolderProps,
  FileApi,
  FilesData,
  Filters,
} from "../types/files";
import type { BreadcrumbApi } from "../types/breadcrumbs";

// ### downloadFile ###
async function downloadFile(
  userId: number,
  fileIds: number
): Promise<{ file: string; fileName: string }> {
  if (!userId || !fileIds) {
    throw new MissingFieldError("Error, missing fields");
  }

  const { local_url: fileLocalUrl, name } = await getFileById(userId, fileIds);

  const file = path.join(__dirname, `../../${fileLocalUrl}`);

  return { file, fileName: name };
}

// ### downloadFiles ###
async function downloadFiles(
  userId: number,
  fileIds: number[]
): Promise<string> {
  if (!userId || fileIds.length === 0) {
    throw new MissingFieldError("Error, missing fields");
  }

  const directory = path.join(__dirname, `../../`);

  const fileNames = await Promise.all(
    fileIds.map(async (fileId) => {
      const { local_url: fileLocalUrl } = await getFileById(userId, fileId);
      return fileLocalUrl;
    })
  );

  const files = fileNames.map((file) => path.join(directory, file));

  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  const zipPath = path.join(__dirname, `../../storage/${userId}/files.zip`);

  const output = fs.createWriteStream(zipPath);

  output.on("close", function () {});

  archive.pipe(output);

  files.forEach((file) => {
    archive.file(file, { name: path.basename(file) });
  });

  await archive.finalize();

  return zipPath;
}

// ### getBreadcrumbs ###
async function getBreadcrumbs(
  userId: number,
  folderIds: string[]
): Promise<BreadcrumbApi[]> {
  if (!userId || !folderIds) {
    throw new MissingFieldError("Error, missing fields");
  }

  const [rows] = (await pool.query(
    `
    SELECT files.id, files.name, files.path
    FROM files
    LEFT JOIN files_data ON files.id = files_data.file_id
    WHERE files_data.user_id = ? AND files.id IN (?)
    `,
    [userId, folderIds]
  )) as unknown as [RowDataPacket[]];

  if (rows.length === 0) {
    throw new RessourceNotFoundError("Error, file not found");
  }

  const fileObject = groupByFileId(rows);
  const breadcrumbs: BreadcrumbApi[] = Object.values(fileObject);

  if (breadcrumbs.some((breadcrumb) => !isBreadcrumbApi(breadcrumb))) {
    throw new WrongTypeError("Error, data is not of type breadcrumbs");
  }

  return breadcrumbs;
}

// ### getFiles ###
async function getFiles(
  userId: number,
  filters: Filters = {},
  tagNames: string[] = [],
  parentId: number | undefined
): Promise<FilesData | {}> {
  if (!userId) {
    throw new MissingFieldError("Error, Error, missing user ID");
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

  if (filters.is_deleted === undefined && filters.is_favorite === undefined) {
    if (parentId) {
      query += " AND files.parent_id = ?";
      values.push(parentId);
    } else {
      query += " AND files.parent_id IS NULL";
    }
  }

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
    throw new WrongTypeError("Error, data is not of type file");
  }

  const filesData: FilesData = {
    files,
    count_files: files.filter((file) => file.is_folder === 0).length,
    count_folders: files.filter((file) => file.is_folder === 1).length,
    total_size: getSizeFile(
      files.reduce((acc, file) => acc + parseInt(file.size), 0)
    ),
  };

  return filesData;
}

// ### getFileById ###
async function getFileById(userId: number, fileId: number): Promise<FileApi> {
  if (!userId || !fileId) {
    throw new MissingFieldError("Error, missing fields");
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
    throw new RessourceNotFoundError("Error, file not found");
  }

  const fileObject = groupByFileId(rows);
  const file: FileApi = Object.values(fileObject)[0] as FileApi;

  if (!isFileApi(file)) {
    throw new WrongTypeError("Error, data is not of type file");
  }

  return file;
}

// ### createFile ###
async function createFile({
  userId,
  file,
  parentId,
}: CreateFileProps): Promise<FileApi> {
  if (!userId || !file) {
    throw new MissingFieldError("Error, missing fields");
  }
  console.log("parentId", parentId);
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existingFiles] = (await connection.query(
      "SELECT * FROM files INNER JOIN files_data ON files.id = files_data.file_id WHERE files_data.user_id = ? AND files.path = ?",
      [userId, file.path]
    )) as unknown as [RowDataPacket[]];

    if (existingFiles.length > 0) {
      throw new AlreadyExists("Error, path already exists for this user");
    }

    const size = getSizeFile(file.size);

    // ## insert entry in file table ##
    const [rows] = (await connection.query(
      "INSERT INTO files (name, size, path, local_url, is_folder, is_favorite, is_deleted, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [file.originalname, size, file.path, file.path, 0, 0, 0, parentId]
    )) as unknown as [ResultSetHeader];

    const fileId = rows.insertId;

    await connection.query(
      "INSERT INTO files_data (user_id, file_id) VALUES (?, ?)",
      [userId, fileId]
    );

    // ## insert entry in files_actions table ##
    const actionIds = getActionIds(false, false);

    for (const actionId of actionIds) {
      await connection.query(
        "INSERT INTO files_actions (file_id, action_id) VALUES (?, ?)",
        [fileId, actionId]
      );
    }

    // ## insert entry in activities table ##
    const activityDescription = `${file.originalname} has been created`;
    await connection.query(
      "INSERT INTO activities (activity, file_id, user_id) VALUES (?, ?, ?)",
      [activityDescription, fileId, userId]
    );

    await connection.commit();

    const newFile: FileApi = await getFileById(userId, fileId);

    if (!isFileApi(newFile)) {
      throw new WrongTypeError("Error, data is not of type file");
    }

    return newFile;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// ### createFolder ###
async function createFolder({
  userId,
  name,
  is_folder,
  parent_id,
}: CreateFolderProps): Promise<FileApi> {
  if (!userId || !name || !is_folder) {
    throw new MissingFieldError("Error, missing fields");
  }

  const connection = await pool.getConnection();

  const path = getFilePath(name);
  const size = getSizeFile(0);

  try {
    await connection.beginTransaction();

    const [existingFiles] = (await connection.query(
      "SELECT * FROM files INNER JOIN files_data ON files.id = files_data.file_id WHERE files_data.user_id = ? AND files.path = ?",
      [userId, path]
    )) as unknown as [RowDataPacket[]];

    if (existingFiles.length > 0) {
      throw new AlreadyExists("Error, path already exists for this user");
    }

    // ## insert entry in file table ##
    const [rows] = (await connection.query(
      "INSERT INTO files (name, size, path, is_folder, is_favorite, is_deleted, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, size, path, is_folder ? 1 : 0, 0, 0, parent_id]
    )) as unknown as [ResultSetHeader];

    const fileId = rows.insertId;

    await connection.query(
      "INSERT INTO files_data (user_id, file_id) VALUES (?, ?)",
      [userId, fileId]
    );

    // ## insert entry in files_actions table ##
    const actionIds = getActionIds(is_folder, false);

    for (const actionId of actionIds) {
      await connection.query(
        "INSERT INTO files_actions (file_id, action_id) VALUES (?, ?)",
        [fileId, actionId]
      );
    }

    // ## insert entry in activities table ##
    const activityDescription = `${name} has been created`;
    await connection.query(
      "INSERT INTO activities (activity, file_id, user_id) VALUES (?, ?, ?)",
      [activityDescription, fileId, userId]
    );

    await connection.commit();

    const newFile: FileApi = await getFileById(userId, fileId);

    if (!isFileApi(newFile)) {
      throw new WrongTypeError("Error, Error, data is not of type file");
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
  update: Omit<
    FileApi,
    "id" | "created_at" | "updated_at" | "actions" | "path" | "local_url"
  >
): Promise<FileApi> {
  if (!userId || !fileId || !update) {
    throw new MissingFieldError("Error, missing fields");
  }
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const [rows] = (await connection.query("UPDATE files SET ? WHERE id = ?", [
      update,
      fileId,
    ])) as unknown as [ResultSetHeader];

    if (rows.affectedRows === 0) {
      throw new RessourceNotFoundError("Error, file not found");
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
      throw new RessourceNotFoundError("Error, file not found");
    }

    if (!isFileApi(updatedFile)) {
      throw new WrongTypeError("Error, data is not of type file");
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
    throw new MissingFieldError("Error, missing fields");
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const keys = Object.keys(update).filter((key) => update[key] !== undefined);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = keys.map((key) => update[key]);
    let activityAction = "updated";

    const [rows] = (await connection.query(
      `UPDATE files 
      INNER JOIN files_data ON files.id = files_data.file_id 
      SET ${setClause} 
      WHERE files.id = ? AND files_data.user_id = ?`,
      [...values, fileId, userId]
    )) as unknown as [ResultSetHeader];

    if (rows.affectedRows === 0) {
      throw new RessourceNotFoundError("Error, file not found");
    }

    // ## update file_path ##
    if (keys.includes("name")) {
      // TODO: Update file path when name is updated
      activityAction = "renamed";
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
      activityAction = update.is_deleted ? "deleted" : "restored";
    }

    if (keys.includes("is_favorite")) {
      activityAction = update.is_favorite ? "favorite" : "unfavorite";
    }

    // ## update activity ##
    const patchFile: FileApi = await getFileById(userId, fileId);
    const { name } = patchFile;
    let activityDescription = `${name} has been ${activityAction}`;
    await connection.query(
      "INSERT INTO activities (activity, file_id, user_id) VALUES (?, ?, ?)",
      [activityDescription, fileId, userId]
    );

    await connection.commit();

    const patchedFile: FileApi = await getFileById(userId, fileId);

    if (!patchedFile) {
      throw new RessourceNotFoundError("Error, file not found");
    }

    if (!isFileApi(patchedFile)) {
      throw new WrongTypeError("Error, data is not of type file");
    }

    return patchedFile;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// ### partialUpdateFiles ###
async function patchFiles(
  userId: number,
  fileIds: number[],
  update: Partial<FileApi>
): Promise<FileApi[]> {
  if (!userId || !fileIds.length || !update) {
    throw new MissingFieldError("Error, missing fields");
  }

  const connection = await pool.getConnection();
  const patchedFiles: FileApi[] = [];

  try {
    await connection.beginTransaction();

    const keys = Object.keys(update).filter((key) => update[key] !== undefined);

    if (keys.length > 0) {
      const setClause = keys.map((key) => `${key} = ?`).join(", ");
      const values = keys.map((key) => update[key]);

      for (const fileId of fileIds) {
        const [rows] = (await connection.query(
          `UPDATE files 
          INNER JOIN files_data ON files.id = files_data.file_id 
          SET ${setClause} 
          WHERE files.id = ? AND files_data.user_id = ?`,
          [...values, fileId, userId]
        )) as unknown as [ResultSetHeader];

        if (rows.affectedRows === 0) {
          throw new RessourceNotFoundError("Error, file not found");
        }

        // ## update files_actions ##
        if (keys.includes("is_deleted")) {
          const actionIds = getActionIds(
            !!update.is_folder,
            !!update.is_deleted
          );

          await connection.query(
            "DELETE FROM files_actions WHERE file_id = ?",
            [fileId]
          );

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

        const patchedFile: FileApi = await getFileById(userId, fileId);

        if (!patchedFile) {
          throw new RessourceNotFoundError("Error, file not found");
        }

        if (!isFileApi(patchedFile)) {
          throw new WrongTypeError("Error, data is not of type file");
        }

        patchedFiles.push(patchedFile);
      }
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return patchedFiles;
}

// ### deleteFile ###
async function deleteFile(userId: number, fileId: number): Promise<void> {
  if (!userId || !fileId) {
    throw new MissingFieldError("Error, missing fields");
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Get the file path
    const [fileRows] = await connection.query(
      "SELECT path, is_folder FROM files WHERE id = ?",
      [fileId]
    );
    const filePath = fileRows[0]?.path;
    const isFolder = fileRows[0]?.is_folder;

    if (!filePath) {
      throw new RessourceNotFoundError("Error, file not found");
    }

    // Delete the file
    if (!isFolder) {
      await unlink(filePath, (err) => {
        if (err) throw err;
      });
    }

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

    await connection.query(
      "DELETE FROM files_data WHERE file_id = ? AND user_id = ?",
      [fileId, userId]
    );

    const [rows] = (await connection.query("DELETE FROM files WHERE id = ?", [
      fileId,
    ])) as unknown as [ResultSetHeader];

    if (rows.affectedRows === 0) {
      throw new RessourceNotFoundError("Error, file not found");
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// ### deleteFiles ###
async function deleteFiles(userId: number, fileIds: number[]): Promise<void> {
  if (!userId || !fileIds.length) {
    throw new MissingFieldError("Error, missing fields");
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for (const fileId of fileIds) {
      await connection.query("DELETE FROM files_actions WHERE file_id = ?", [
        fileId,
      ]);
      await connection.query("DELETE FROM files_tags WHERE files_id = ?", [
        fileId,
      ]);
      await connection.query("DELETE FROM activities WHERE file_id = ?", [
        fileId,
      ]);
      await connection.query("DELETE FROM comments WHERE file_id = ?", [
        fileId,
      ]);
      await connection.query(
        "DELETE FROM files_data WHERE file_id = ? AND user_id = ?",
        [fileId, userId]
      );
    }

    const [rows] = (await connection.query(
      "DELETE FROM files WHERE id IN (?)",
      [fileIds]
    )) as unknown as [ResultSetHeader];

    if (rows.affectedRows === 0) {
      throw new RessourceNotFoundError("Files not found.");
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export {
  getBreadcrumbs,
  downloadFile,
  downloadFiles,
  getFiles,
  getFileById,
  createFile,
  createFolder,
  updateFile,
  patchFile,
  patchFiles,
  deleteFile,
  deleteFiles,
};
