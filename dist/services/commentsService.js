"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.createComment = exports.getCommentById = exports.getComments = void 0;
const database_1 = require("../database");
const utils_1 = require("../utils");
const utils_2 = require("./utils");
// ### getComments ###
async function getComments(userId, fileId) {
    if (!userId || !fileId) {
        throw new utils_1.MissingFieldError("Missing fields.");
    }
    const [rows] = (await database_1.pool.query("SELECT * FROM comments WHERE user_id = ? AND file_id = ?", [userId, fileId]));
    if (rows.length === 0) {
        throw new utils_1.RessourceNotFoundError("Comments not found.");
    }
    const comments = rows.map((row) => {
        return {
            id: row.id,
            comment: row.comment,
            created_at: row.created_at,
            updated_at: row.updated_at,
            file_id: row.file_id,
            user_id: row.user_id,
        };
    });
    if (comments.some((comment) => !(0, utils_2.isCommentApi)(comment))) {
        throw new utils_1.WrongTypeError("Data is not of type Comment");
    }
    return comments;
}
exports.getComments = getComments;
// ### getCommentById ###
async function getCommentById(userId, fileId, commentId) {
    if (!fileId || !commentId) {
        throw new utils_1.MissingFieldError("Missing fields.");
    }
    const [rows] = (await database_1.pool.query("SELECT * FROM comments WHERE user_id = ? AND file_id = ? AND id = ?", [userId, fileId, commentId]));
    if (rows.length === 0) {
        throw new utils_1.RessourceNotFoundError("Comment not found.");
    }
    const data = rows[0];
    const comment = {
        id: data.id,
        comment: data.comment,
        created_at: data.created_at,
        updated_at: data.updated_at,
        file_id: data.file_id,
        user_id: data.user_id,
    };
    if (!(0, utils_2.isCommentApi)(comment)) {
        throw new utils_1.WrongTypeError("Data is not of type Comment");
    }
    return comment;
}
exports.getCommentById = getCommentById;
// ### createComment ###
async function createComment(userId, fileId, comment) {
    if (!userId || !fileId || !comment) {
        throw new utils_1.MissingFieldError("Missing fields.");
    }
    const [result] = (await database_1.pool.query("INSERT INTO comments (file_id, user_id, comment) VALUES (?, ?, ?)", [fileId, userId, comment]));
    const newComment = getCommentById(userId, fileId, result.insertId);
    return newComment;
}
exports.createComment = createComment;
// ### deleteComment ###
async function deleteComment(userId, fileId, commentId) {
    if (!userId || !fileId || !commentId) {
        throw new utils_1.MissingFieldError("Missing fields.");
    }
    const [result] = (await database_1.pool.query("DELETE FROM comments WHERE file_id = ? AND id = ?", [fileId, commentId]));
    const affectedRows = result.affectedRows;
    if (affectedRows === 0) {
        throw new utils_1.RessourceNotFoundError("Comment not found.");
    }
}
exports.deleteComment = deleteComment;
