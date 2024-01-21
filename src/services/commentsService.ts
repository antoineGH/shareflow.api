import type { RowDataPacket } from "pg";
import { pool } from "../database";
import {
  MissingFieldError,
  RessourceNotFoundError,
  WrongTypeError,
} from "../utils";
import type { CommentApi } from "../types/comments";
import { isCommentApi } from "./utils";
import { getFileById } from "./filesService";

// ### getComments ###
async function getComments(
  userId: number,
  fileId: number
): Promise<CommentApi[]> {
  if (!userId || !fileId) {
    throw new MissingFieldError("Error, missing fields");
  }

  const query = `
    SELECT comments.*, users.full_name, users.avatar_url 
    FROM comments 
    INNER JOIN users ON comments.user_id = users.id 
    WHERE comments.file_id = $1`;

  const values = [fileId];

  const result = (await pool.query(query, values)) as unknown as {
    rows: RowDataPacket[];
  };

  if (result.rows.length === 0) {
    return [];
  }

  const comments: CommentApi[] = result.rows.map((row) => {
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
    throw new MissingFieldError("Error, missing fields");
  }

  const query = `
    SELECT comments.*, users.full_name, users.avatar_url 
    FROM comments 
    INNER JOIN users ON comments.user_id = users.id 
    WHERE comments.user_id = $1 AND comments.file_id = $2 AND comments.id = $3`;

  const values = [userId, fileId, commentId];

  const result = (await pool.query(query, values)) as unknown as {
    rows: RowDataPacket[];
  };

  if (result.rows.length === 0) {
    throw new RessourceNotFoundError("Comment not found.");
  }

  const data = result.rows[0];

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
    throw new MissingFieldError("Error, missing fields");
  }
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const query =
      "INSERT INTO comments (file_id, user_id, comment) VALUES ($1, $2, $3) RETURNING id";
    const values = [fileId, userId, comment];

    const { rows } = await pool.query(query, values);

    const commentId = rows[0].id;

    const file = await getFileById(userId, fileId);

    // ## insert entry in activities table ##
    const activityDescription = `${file.name} commented`;
    await client.query(
      "INSERT INTO activities (activity, file_id, user_id) VALUES ($1, $2, $3)",
      [activityDescription, fileId, userId]
    );

    await client.query("COMMIT");

    const newComment = await getCommentById(userId, fileId, commentId);

    return newComment;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// ### deleteComment ###
async function deleteComment(
  userId: number,
  fileId: number,
  commentId: number
): Promise<void> {
  if (!userId || !fileId || !commentId) {
    throw new MissingFieldError("Error, missing fields");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const query = "DELETE FROM comments WHERE file_id = $1 AND id = $2";
    const values = [fileId, commentId];

    const { rowCount } = await pool.query(query, values);

    if (rowCount === 0) {
      throw new RessourceNotFoundError("Comment not found.");
    }

    const file = await getFileById(userId, fileId);

    // ## insert entry in activities table ##
    const activityDescription = `${file.name} uncommented`;
    await client.query(
      "INSERT INTO activities (activity, file_id, user_id) VALUES ($1, $2, $3)",
      [activityDescription, fileId, userId]
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export { getComments, getCommentById, createComment, deleteComment };
