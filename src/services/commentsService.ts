import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../database";
import {
  MissingFieldError,
  RessourceNotFoundError,
  WrongTypeError,
} from "../utils";
import type { CommentApi } from "../types/comments";
import { isCommentApi } from "./utils";

// ### getComments ###
async function getComments(
  userId: number,
  fileId: number
): Promise<CommentApi[]> {
  if (!userId || !fileId) {
    throw new MissingFieldError("Missing fields.");
  }
  const [rows] = (await pool.query(
    `SELECT comments.*, users.full_name, users.avatar_url 
     FROM comments 
     INNER JOIN users ON comments.user_id = users.id 
     WHERE comments.file_id = ?`,
    [fileId]
  )) as unknown as [RowDataPacket[]];

  if (rows.length === 0) {
    return [];
  }

  const comments: CommentApi[] = rows.map((row) => {
    return {
      id: row.id,
      comment: row.comment,
      created_at: row.created_at,
      updated_at: row.updated_at,
      file_id: row.file_id,
      user: {
        user_id: row.user_id,
        full_name: row.full_name,
        avatar_url: row.avatar_url,
      },
    };
  });

  if (comments.some((comment) => !isCommentApi(comment))) {
    throw new WrongTypeError("Data is not of type Comment");
  }

  return comments;
}

// ### getCommentById ###
async function getCommentById(
  userId: number,
  fileId: number,
  commentId: number
): Promise<CommentApi> {
  if (!fileId || !commentId) {
    throw new MissingFieldError("Missing fields.");
  }
  const [rows] = (await pool.query(
    `SELECT comments.*, users.full_name, users.avatar_url 
     FROM comments 
     INNER JOIN users ON comments.user_id = users.id 
     WHERE comments.user_id = ? AND comments.file_id = ? AND comments.id = ?`,
    [userId, fileId, commentId]
  )) as unknown as RowDataPacket[];

  if (rows.length === 0) {
    throw new RessourceNotFoundError("Comment not found.");
  }

  const data = rows[0];

  const comment: CommentApi = {
    id: data.id,
    comment: data.comment,
    created_at: data.created_at,
    updated_at: data.updated_at,
    file_id: data.file_id,
    user: {
      user_id: data.user_id,
      full_name: data.full_name,
      avatar_url: data.avatar_url,
    },
  };

  if (!isCommentApi(comment)) {
    throw new WrongTypeError("Data is not of type Comment");
  }

  return comment;
}

// ### createComment ###
async function createComment(
  userId: number,
  fileId: number,
  comment: string
): Promise<CommentApi> {
  if (!userId || !fileId || !comment) {
    throw new MissingFieldError("Missing fields.");
  }
  const [result] = (await pool.query(
    "INSERT INTO comments (file_id, user_id, comment) VALUES (?, ?, ?)",
    [fileId, userId, comment]
  )) as ResultSetHeader[];

  const newComment = getCommentById(userId, fileId, result.insertId);

  return newComment;
}

// ### deleteComment ###
async function deleteComment(
  userId: number,
  fileId: number,
  commentId: number
): Promise<void> {
  if (!userId || !fileId || !commentId) {
    throw new MissingFieldError("Missing fields.");
  }
  const [result] = (await pool.query(
    "DELETE FROM comments WHERE file_id = ? AND id = ?",
    [fileId, commentId]
  )) as ResultSetHeader[];

  const affectedRows = result.affectedRows;

  if (affectedRows === 0) {
    throw new RessourceNotFoundError("Comment not found.");
  }
}

export { getComments, getCommentById, createComment, deleteComment };
