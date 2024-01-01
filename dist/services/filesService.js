"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.patchFile = exports.updateFile = exports.createFile = exports.getFileById = exports.getFiles = void 0;
const database_1 = require("../database");
const utils_1 = require("../utils");
const utils_2 = require("./utils");
// ### getFiles ###
async function getFiles(userId, filters = {}, tagNames = []) {
    if (!userId) {
        throw new utils_1.MissingFieldError("Missing user ID.");
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
    const values = [userId];
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
    const [rows] = (await database_1.pool.query(query, values));
    if (rows.length === 0) {
        throw new utils_1.RessourceNotFoundError("Files not found.");
    }
    const fileObject = (0, utils_2.groupByFileId)(rows);
    const files = Object.values(fileObject);
    if (files.some((file) => !(0, utils_2.isFileApi)(file))) {
        throw new utils_1.WrongTypeError("Data is not of type File");
    }
    return files;
}
exports.getFiles = getFiles;
// ### getFileById ###
async function getFileById(userId, fileId) {
    if (!userId || !fileId) {
        throw new utils_1.MissingFieldError("Missing fields.");
    }
    const [rows] = (await database_1.pool.query(`
    SELECT files.*, actions.name as actions
    FROM files
    LEFT JOIN files_actions ON files.id = files_actions.file_id
    LEFT JOIN actions ON files_actions.action_id = actions.id
    LEFT JOIN files_data ON files.id = files_data.file_id
    WHERE files_data.user_id = ? AND files.id = ?
    `, [userId, fileId]));
    if (rows.length === 0) {
        throw new utils_1.RessourceNotFoundError("File not found.");
    }
    const fileObject = (0, utils_2.groupByFileId)(rows);
    const file = Object.values(fileObject)[0];
    if (!(0, utils_2.isFileApi)(file)) {
        throw new utils_1.WrongTypeError("Data is not of type File");
    }
    return file;
}
exports.getFileById = getFileById;
// ### createFile ###
async function createFile({ userId, name, size, path, is_folder, is_favorite, is_deleted, }) {
    if (!userId || !name || !size || !path) {
        throw new utils_1.MissingFieldError("Missing fields.");
    }
    const connection = await database_1.pool.getConnection();
    try {
        await connection.beginTransaction();
        const [existingFiles] = (await connection.query("SELECT * FROM files INNER JOIN files_data ON files.id = files_data.file_id WHERE files_data.user_id = ? AND files.path = ?", [userId, path]));
        if (existingFiles.length > 0) {
            throw new utils_1.AlreadyExists("Path already exists for this user.");
        }
        // ## insert entry in file table ##
        const [rows] = (await connection.query("INSERT INTO files (name, size, path, is_favorite, is_deleted) VALUES (?, ?, ?, ?, ?)", [name, size, path, is_favorite ? 1 : 0, is_deleted ? 1 : 0]));
        const fileId = rows.insertId;
        await connection.query("INSERT INTO files_data (user_id, file_id) VALUES (?, ?)", [userId, fileId]);
        // ## insert entry in files_actions table ##
        const actionIds = (0, utils_2.getActionIds)(is_folder, is_deleted);
        for (const actionId of actionIds) {
            await connection.query("INSERT INTO files_actions (file_id, action_id) VALUES (?, ?)", [fileId, actionId]);
        }
        // ## insert entry in activities table ##
        const activityDescription = `${name} has been created.`;
        await connection.query("INSERT INTO activities (activity, file_id, user_id) VALUES (?, ?, ?)", [activityDescription, fileId, userId]);
        await connection.commit();
        const newFile = await getFileById(userId, fileId);
        if (!(0, utils_2.isFileApi)(newFile)) {
            throw new utils_1.WrongTypeError("Data is not of type File");
        }
        return newFile;
    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
    finally {
        connection.release();
    }
}
exports.createFile = createFile;
// ### updateFile ###
async function updateFile(userId, fileId, update) {
    if (!userId || !fileId || !update) {
        throw new utils_1.MissingFieldError("Missing fields.");
    }
    const connection = await database_1.pool.getConnection();
    await connection.beginTransaction();
    try {
        const [rows] = (await connection.query("UPDATE files SET ? WHERE id = ?", [
            update,
            fileId,
        ]));
        if (rows.affectedRows === 0) {
            throw new utils_1.RessourceNotFoundError("File not found.");
        }
        // ## update files_actions ##
        const actionIds = (0, utils_2.getActionIds)(update.is_folder === 1, update.is_deleted === 1);
        await connection.query("DELETE FROM files_actions WHERE file_id = ?", [
            fileId,
        ]);
        for (const actionId of actionIds) {
            await connection.query("INSERT INTO files_actions (file_id, action_id) VALUES (?, ?)", [fileId, actionId]);
        }
        // ## update activity ##
        const patchFile = await getFileById(userId, fileId);
        const { name } = patchFile;
        const activityDescription = `${name} has been updated.`;
        await connection.query("INSERT INTO activities (activity, file_id, user_id) VALUES (?, ?, ?)", [activityDescription, fileId, userId]);
        await connection.commit();
    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
    finally {
        connection.release();
    }
}
exports.updateFile = updateFile;
// ### partialUpdateFile ###
async function patchFile(userId, fileId, update) {
    if (!userId || !fileId || !update) {
        throw new utils_1.MissingFieldError("Missing fields.");
    }
    const connection = await database_1.pool.getConnection();
    try {
        await connection.beginTransaction();
        const keys = Object.keys(update).filter((key) => update[key] !== undefined);
        const setClause = keys.map((key) => `${key} = ?`).join(", ");
        const values = keys.map((key) => update[key]);
        const [rows] = (await connection.query(`UPDATE files 
      INNER JOIN files_data ON files.id = files_data.file_id 
      SET ${setClause} 
      WHERE files.id = ? AND files_data.user_id = ?`, [...values, fileId, userId]));
        if (rows.affectedRows === 0) {
            throw new utils_1.RessourceNotFoundError("File not found.");
        }
        // ## update files_actions ##
        if (keys.includes("is_deleted")) {
            const actionIds = (0, utils_2.getActionIds)(update.is_folder === 1, update.is_deleted === 1);
            await connection.query("DELETE FROM files_actions WHERE file_id = ?", [
                fileId,
            ]);
            for (const actionId of actionIds) {
                await connection.query("INSERT INTO files_actions (file_id, action_id) VALUES (?, ?)", [fileId, actionId]);
            }
        }
        // ## update activity ##
        const patchFile = await getFileById(userId, fileId);
        const { name } = patchFile;
        const activityDescription = `${name} has been updated.`;
        await connection.query("INSERT INTO activities (activity, file_id, user_id) VALUES (?, ?, ?)", [activityDescription, fileId, userId]);
        await connection.commit();
    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
    finally {
        connection.release();
    }
}
exports.patchFile = patchFile;
// ### deleteFile ###
async function deleteFile(userId, fileId) {
    if (!userId || !fileId) {
        throw new utils_1.MissingFieldError("Missing fields.");
    }
    const connection = await database_1.pool.getConnection();
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
        const [rows] = (await connection.query("DELETE FROM files WHERE id = ? AND user_id = ?", [fileId, userId]));
        if (rows.affectedRows === 0) {
            throw new utils_1.RessourceNotFoundError("File not found.");
        }
        await connection.commit();
    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
    finally {
        connection.release();
    }
}
exports.deleteFile = deleteFile;
