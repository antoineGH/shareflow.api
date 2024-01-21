import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../database";
import path from "path";
import { PoolClient } from "pg";
import archiver from "archiver";
import fs, { unlink } from "fs";
import {
  AlreadyExists,
  MissingFieldError,
  NotEnoughSpace,
  RessourceNotFoundError,
  WrongTypeError,
} from "../utils";
import {
  getActionIds,
  getFilePath,
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

  const { rows } = await pool.query(
    `
    SELECT files.id, files.name, files.path
    FROM files
    LEFT JOIN files_data ON files.id = files_data.file_id
    WHERE files_data.user_id = $1 AND files.id = ANY($2::int[])
    `,
    [userId, folderIds]
  );

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
    throw new MissingFieldError("Error, missing user ID");
  }

  let query = `
    SELECT files.*, actions.name as actions
    FROM files
    LEFT JOIN files_actions ON files.id = files_actions.file_id
    LEFT JOIN actions ON files_actions.action_id = actions.id
    LEFT JOIN files_data ON files.id = files_data.file_id
    LEFT JOIN files_tags ON files.id = files_tags.files_id
    LEFT JOIN tags ON files_tags.tags_id = tags.id
    WHERE files_data.user_id = $1
  `;

  const values: (number | string[])[] = [userId];

  if (filters.all_files !== undefined) {
    query += " AND files.is_deleted = $2";
    values.push(filters.all_files ? 0 : 1);
  }

  if (filters.is_favorite !== undefined) {
    query += " AND files.is_favorite = $3";
    values.push(filters.is_favorite ? 1 : 0);
  }

  if (filters.is_deleted !== undefined) {
    query += " AND files.is_deleted = $4";
    values.push(filters.is_deleted ? 1 : 0);
  }

  if (tagNames.length > 0) {
    query += " AND tags.tag IN ($5:csv)";
    values.push(tagNames);
  }

  if (
    filters.is_deleted === undefined &&
    filters.is_favorite === undefined &&
    tagNames.length === 0
  ) {
    if (parentId) {
      query += " AND files.parent_id = $6";
      values.push(parentId);
    } else {
      query += " AND files.parent_id IS NULL";
    }
  }

  const { rows } = await pool.query(query, values);

  if (rows.length === 0) {
    return {};
  }

  const fileObject = groupByFileId(rows);
  const files: FileApi[] = Object.values(fileObject);

  if (files.some((file) => !isFileApi(file))) {
    throw new WrongTypeError("Error, data is not of type file");
  }

  const filesSize = files.reduce((acc, file) => acc + file.size, 0);

  const filesData: FilesData = {
    files,
    count_files: files.filter((file) => file.is_folder === 0).length,
    count_folders: files.filter((file) => file.is_folder === 1).length,
    total_size: filesSize,
  };

  return filesData;
}

// ### getFileById ###
async function getFileById(userId: number, fileId: number): Promise<FileApi> {
  if (!userId || !fileId) {
    throw new MissingFieldError("Error, missing fields");
  }

  const { rows } = await pool.query(
    `
    SELECT files.*, actions.name as actions
    FROM files
    LEFT JOIN files_actions ON files.id = files_actions.file_id
    LEFT JOIN actions ON files_actions.action_id = actions.id
    LEFT JOIN files_data ON files.id = files_data.file_id
    WHERE files_data.user_id = $1 AND files.id = $2
    `,
    [userId, fileId]
  );

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

  const client: PoolClient = await pool.connect();

  try {
    await client.query("BEGIN");

    // ## check for existing files ##
    const existingFilesResult = await client.query(
      "SELECT * FROM files INNER JOIN files_data ON files.id = files_data.file_id WHERE files_data.user_id = $1 AND files.path = $2",
      [userId, file.path]
    );
    const existingFiles = existingFilesResult.rows;

    if (existingFiles.length > 0) {
      throw new AlreadyExists("Error, path already exists for this user");
    }

    // ## update storage settings quota ##
    const storageRowsResult = await client.query(
      "SELECT storage_used, total_storage FROM settings WHERE user_id = $1",
      [userId]
    );
    const storageRows = storageRowsResult.rows;

    const newStorageUsed = storageRows[0].storage_used + file.size;
    if (storageRows[0].total_storage - newStorageUsed < 0) {
      throw new NotEnoughSpace("Error, not enough storage space");
    }

    await client.query(
      "UPDATE settings SET storage_used = $1 WHERE user_id = $2",
      [newStorageUsed, userId]
    );

    // ## insert entry in file table ##
    const fileInsertResult = await client.query(
      "INSERT INTO files (name, size, path, local_url, is_folder, is_favorite, is_deleted, parent_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
      [file.originalname, file.size, file.path, file.path, 0, 0, 0, parentId]
    );
    const fileId = fileInsertResult.rows[0].id;

    await client.query(
      "INSERT INTO files_data (user_id, file_id) VALUES ($1, $2)",
      [userId, fileId]
    );

    // ## insert entry in files_actions table ##
    const actionIds = getActionIds(false, false);

    for (const actionId of actionIds) {
      await client.query(
        "INSERT INTO files_actions (file_id, action_id) VALUES ($1, $2)",
        [fileId, actionId]
      );
    }

    // ## insert entry in activities table ##
    const activityDescription = `${file.originalname} has been created`;
    await client.query(
      "INSERT INTO activities (activity, file_id, user_id) VALUES ($1, $2, $3)",
      [activityDescription, fileId, userId]
    );

    await client.query("COMMIT");

    const newFile: FileApi = await getFileById(userId, fileId);

    if (!isFileApi(newFile)) {
      throw new WrongTypeError("Error, data is not of type file");
    }

    return newFile;
  } catch (error) {
    await client.query("ROLLBACK");
    await unlink(file.path, (err) => {
      if (err) throw err;
    });
    throw error;
  } finally {
    client.release();
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

  const client: PoolClient = await pool.connect();
  const path = getFilePath(name);

  try {
    await client.query("BEGIN");

    const [existingFiles] = (
      await client.query(
        "SELECT * FROM files INNER JOIN files_data ON files.id = files_data.file_id WHERE files_data.user_id = $1 AND files.path = $2",
        [userId, path]
      )
    ).rows;

    if (existingFiles.length > 0) {
      throw new AlreadyExists("Error, path already exists for this user");
    }

    // ## insert entry in file table ##
    const result = await client.query(
      "INSERT INTO files (name, size, path, is_folder, is_favorite, is_deleted, parent_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [name, 0, path, is_folder ? 1 : 0, 0, 0, parent_id]
    );

    const fileId = result.rows[0].id;

    await client.query(
      "INSERT INTO files_data (user_id, file_id) VALUES ($1, $2)",
      [userId, fileId]
    );

    // ## insert entry in files_actions table ##
    const actionIds = getActionIds(is_folder, false);

    for (const actionId of actionIds) {
      await client.query(
        "INSERT INTO files_actions (file_id, action_id) VALUES ($1, $2)",
        [fileId, actionId]
      );
    }

    // ## insert entry in activities table ##
    const activityDescription = `${name} has been created`;
    await client.query(
      "INSERT INTO activities (activity, file_id, user_id) VALUES ($1, $2, $3)",
      [activityDescription, fileId, userId]
    );

    await client.query("COMMIT");

    const newFile: FileApi = await getFileById(userId, fileId);

    if (!isFileApi(newFile)) {
      throw new WrongTypeError("Error, data is not of type file");
    }

    return newFile;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
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

  const client: PoolClient = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query("UPDATE files SET $1:raw WHERE id = $2", [
      update,
      fileId,
    ]);

    if (result.rowCount === 0) {
      throw new RessourceNotFoundError("Error, file not found");
    }

    // ## update files_actions ##
    const actionIds = getActionIds(!!update.is_folder, !!update.is_deleted);

    await client.query("DELETE FROM files_actions WHERE file_id = $1", [
      fileId,
    ]);

    for (const actionId of actionIds) {
      await client.query(
        "INSERT INTO files_actions (file_id, action_id) VALUES ($1, $2)",
        [fileId, actionId]
      );
    }

    // ## update activity ##
    const patchFile: FileApi = await getFileById(userId, fileId);
    const { name } = patchFile;
    const activityDescription = `${name} has been updated.`;
    await client.query(
      "INSERT INTO activities (activity, file_id, user_id) VALUES ($1, $2, $3)",
      [activityDescription, fileId, userId]
    );

    await client.query("COMMIT");

    const updatedFile: FileApi = await getFileById(userId, fileId);

    if (!updatedFile) {
      throw new RessourceNotFoundError("Error, file not found");
    }

    if (!isFileApi(updatedFile)) {
      throw new WrongTypeError("Error, data is not of type file");
    }

    return updatedFile;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
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

  const client: PoolClient = await pool.connect();

  try {
    await client.query("BEGIN");

    const keys = Object.keys(update).filter((key) => update[key] !== undefined);
    const setClause = keys
      .map((key) => `${key} = $${keys.indexOf(key) + 1}`)
      .join(", ");
    const values = keys.map((key) => update[key]);
    let activityAction = "updated";

    const result = await client.query(
      `UPDATE files 
      INNER JOIN files_data ON files.id = files_data.file_id 
      SET ${setClause} 
      WHERE files.id = $${keys.length + 1} AND files_data.user_id = $${
        keys.length + 2
      }`,
      [...values, fileId, userId]
    );

    if (result.rowCount === 0) {
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

      await client.query("DELETE FROM files_actions WHERE file_id = $1", [
        fileId,
      ]);

      for (const actionId of actionIds) {
        await client.query(
          "INSERT INTO files_actions (file_id, action_id) VALUES ($1, $2)",
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
    await client.query(
      "INSERT INTO activities (activity, file_id, user_id) VALUES ($1, $2, $3)",
      [activityDescription, fileId, userId]
    );

    await client.query("COMMIT");

    const patchedFile: FileApi = await getFileById(userId, fileId);

    if (!patchedFile) {
      throw new RessourceNotFoundError("Error, file not found");
    }

    if (!isFileApi(patchedFile)) {
      throw new WrongTypeError("Error, data is not of type file");
    }

    return patchedFile;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
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

  const client: PoolClient = await pool.connect();
  const patchedFiles: FileApi[] = [];

  try {
    await client.query("BEGIN");

    const keys = Object.keys(update).filter((key) => update[key] !== undefined);

    if (keys.length > 0) {
      const setClause = keys
        .map((key) => `${key} = $${keys.indexOf(key) + 1}`)
        .join(", ");
      const values = keys.map((key) => update[key]);

      for (const fileId of fileIds) {
        const result = await client.query(
          `UPDATE files 
          INNER JOIN files_data ON files.id = files_data.file_id 
          SET ${setClause} 
          WHERE files.id = $${keys.length + 1} AND files_data.user_id = $${
            keys.length + 2
          }`,
          [...values, fileId, userId]
        );

        if (result.rowCount === 0) {
          throw new RessourceNotFoundError("Error, file not found");
        }

        // ## update files_actions ##
        if (keys.includes("is_deleted")) {
          const actionIds = getActionIds(
            !!update.is_folder,
            !!update.is_deleted
          );

          await client.query("DELETE FROM files_actions WHERE file_id = $1", [
            fileId,
          ]);

          for (const actionId of actionIds) {
            await client.query(
              "INSERT INTO files_actions (file_id, action_id) VALUES ($1, $2)",
              [fileId, actionId]
            );
          }
        }

        // ## update activity ##
        const patchFile: FileApi = await getFileById(userId, fileId);
        const { name } = patchFile;
        let activityDescription = `${name} has been updated.`;
        await client.query(
          "INSERT INTO activities (activity, file_id, user_id) VALUES ($1, $2, $3)",
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

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return patchedFiles;
}

// ### deleteFile ###
async function deleteFile(userId: number, fileId: number): Promise<void> {
  if (!userId || !fileId) {
    throw new MissingFieldError("Error, missing fields");
  }

  const client: PoolClient = await pool.connect();

  try {
    await client.query("BEGIN");

    // Get the file path
    const fileRows = (
      await client.query(
        "SELECT local_url, is_folder FROM files WHERE id = $1",
        [fileId]
      )
    ).rows;
    const filePath = fileRows[0]?.local_url;
    const isFolder = fileRows[0]?.is_folder;

    if (!filePath) {
      throw new RessourceNotFoundError("Error, file not found");
    }

    // Delete the file
    if (!isFolder) {
      await unlink(filePath, (err) => {
        if (err) throw err;
      });

      const fileRows = (
        await client.query("SELECT size FROM files WHERE id = $1", [fileId])
      ).rows;

      const fileSize = fileRows[0].size;

      // add up settings storage in quota
      const storageRows = (
        await client.query(
          "SELECT storage_used FROM settings WHERE user_id = $1",
          [userId]
        )
      ).rows;

      const newStorageUsed = storageRows[0].storage_used - fileSize;

      await client.query(
        "UPDATE settings SET storage_used = $1 WHERE user_id = $2",
        [newStorageUsed, userId]
      );
    }

    await client.query("DELETE FROM files_actions WHERE file_id = $1", [
      fileId,
    ]);
    await client.query("DELETE FROM files_tags WHERE files_id = $1", [fileId]);
    await client.query("DELETE FROM activities WHERE file_id = $1", [fileId]);
    await client.query("DELETE FROM comments WHERE file_id = $1", [fileId]);
    await client.query(
      "DELETE FROM files_data WHERE file_id = $1 AND user_id = $2",
      [fileId, userId]
    );

    const result = await client.query("DELETE FROM files WHERE id = $1", [
      fileId,
    ]);

    if (result.rowCount === 0) {
      throw new RessourceNotFoundError("Error, file not found");
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// ### deleteFiles ###

async function deleteFiles(userId: number, fileIds: number[]): Promise<void> {
  if (!userId || !fileIds.length) {
    throw new MissingFieldError("Error, missing fields");
  }

  const client: PoolClient = await pool.connect();

  try {
    await client.query("BEGIN");

    const fileRows = (
      await client.query(
        "SELECT id, local_url, is_folder, size FROM files WHERE id = ANY($1)",
        [fileIds]
      )
    ).rows;

    if (!fileRows.length) {
      throw new RessourceNotFoundError("Error, files not found");
    }

    for (const file of fileRows) {
      const filePath = file.local_url;
      const isFolder = file.is_folder;
      const fileSize = file.size;

      if (!isFolder) {
        await unlink(filePath, (err) => {
          if (err) throw err;
        });

        // add up settings storage in quota
        const storageRows = (
          await client.query(
            "SELECT storage_used FROM settings WHERE user_id = $1",
            [userId]
          )
        ).rows;

        const newStorageUsed = storageRows[0].storage_used - fileSize;

        await client.query(
          "UPDATE settings SET storage_used = $1 WHERE user_id = $2",
          [newStorageUsed, userId]
        );
      }
    }

    for (const fileId of fileIds) {
      await client.query("DELETE FROM files_actions WHERE file_id = $1", [
        fileId,
      ]);
      await client.query("DELETE FROM files_tags WHERE files_id = $1", [
        fileId,
      ]);
      await client.query("DELETE FROM activities WHERE file_id = $1", [fileId]);
      await client.query("DELETE FROM comments WHERE file_id = $1", [fileId]);
      await client.query(
        "DELETE FROM files_data WHERE file_id = $1 AND user_id = $2",
        [fileId, userId]
      );
    }

    const result = await client.query("DELETE FROM files WHERE id = ANY($1)", [
      fileIds,
    ]);

    if (result.rowCount === 0) {
      throw new RessourceNotFoundError("Files not found.");
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
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
