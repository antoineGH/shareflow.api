"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTag = exports.createTag = exports.getTagById = exports.getTags = void 0;
const database_1 = require("../database");
const utils_1 = require("../utils");
const utils_2 = require("./utils");
// ### getTags ###
async function getTags(userId, fileId) {
    if (!userId) {
        throw new utils_1.MissingFieldError("Missing user ID.");
    }
    const [rows] = (await database_1.pool.query(`
      SELECT tags.*
      FROM tags
      JOIN files_tags ON tags.id = files_tags.tags_id
      JOIN files ON files.id = files_tags.files_id
      WHERE files.id = ? AND tags.user_id = ?
    `, [fileId, userId]));
    if (rows.length === 0) {
        throw new utils_1.RessourceNotFoundError("Tags not found.");
    }
    const tags = rows.map((row) => {
        return {
            id: row.id,
            tag: row.tag,
            created_at: row.created_at,
            user_id: row.user_id,
        };
    });
    if (tags.some((tag) => !(0, utils_2.isTagApi)(tag))) {
        throw new utils_1.WrongTypeError("Data is not of type Tag");
    }
    return tags;
}
exports.getTags = getTags;
// ### getTagById ###
async function getTagById(userId, fileId, tagId) {
    if (!userId || !fileId || !tagId) {
        throw new utils_1.MissingFieldError("Missing fields.");
    }
    const [rows] = (await database_1.pool.query(`
      SELECT tags.*
      FROM tags
      JOIN files_tags ON tags.id = files_tags.tags_id
      JOIN files ON files.id = files_tags.files_id
      WHERE files.id = ? AND tags.user_id = ? AND tags.id = ?
    `, [fileId, userId, tagId]));
    if (rows.length === 0) {
        throw new utils_1.RessourceNotFoundError("Tag not found.");
    }
    const data = rows[0];
    const tag = {
        id: data.id,
        tag: data.tag,
        created_at: data.created_at,
        user_id: data.user_id,
    };
    if (!(0, utils_2.isTagApi)(tag)) {
        throw new utils_1.WrongTypeError("Data is not of type Tag");
    }
    return tag;
}
exports.getTagById = getTagById;
// ### createTag ###
async function createTag(userId, fileId, tagName) {
    if (!userId || !fileId || !tagName) {
        throw new utils_1.MissingFieldError("Missing fields.");
    }
    // Check if the tag already exists
    const [existingTagRows] = (await database_1.pool.query(`
    SELECT * FROM tags
    WHERE tag = ? AND user_id = ?
  `, [tagName, userId]));
    let tagId;
    if (existingTagRows.length > 0) {
        // If the tag exists, use its id
        tagId = existingTagRows[0].id;
    }
    else {
        // If not, insert into tags table
        const [tagRows] = (await database_1.pool.query(`
      INSERT INTO tags (tag, user_id)
      VALUES (?, ?)
    `, [tagName, userId]));
        tagId = tagRows.insertId;
    }
    // Check if the association between the tag and the file already exists in the files_tags table
    const [existingAssociationRows] = (await database_1.pool.query(`
    SELECT * FROM files_tags
    WHERE files_id = ? AND tags_id = ?
  `, [fileId, tagId]));
    if (existingAssociationRows.length === 0) {
        // If the association does not exist, create it
        await database_1.pool.query(`
      INSERT INTO files_tags (files_id, tags_id)
      VALUES (?, ?)
    `, [fileId, tagId]);
    }
    const newTag = getTagById(userId, fileId, tagId);
    return newTag;
}
exports.createTag = createTag;
// ### deleteTag ###
async function deleteTag(userId, fileId, tagId) {
    if (!userId || !fileId || !tagId) {
        throw new utils_1.MissingFieldError("Missing fields.");
    }
    const connection = await database_1.pool.getConnection();
    try {
        await connection.beginTransaction();
        const [associationRows] = (await connection.query("DELETE FROM files_tags WHERE files_id = ? AND tags_id = ?", [fileId, tagId]));
        const [tagRows] = (await connection.query("SELECT * FROM files_tags WHERE tags_id = ?", [tagId]));
        if (tagRows.length === 0) {
            await connection.query("DELETE FROM tags WHERE id = ? AND user_id = ?", [
                tagId,
                userId,
            ]);
        }
        const affectedRows = associationRows.affectedRows;
        if (affectedRows === 0) {
            throw new utils_1.RessourceNotFoundError("Tag not found.");
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
exports.deleteTag = deleteTag;
