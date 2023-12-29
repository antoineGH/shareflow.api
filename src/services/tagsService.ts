import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../database";
import {
  MissingFieldError,
  RessourceNotFoundError,
  WrongTypeError,
} from "../utils";
import { isTagApi } from "./utils";
import type { TagApi } from "../types/tags";

// ### getTags ###
async function getTags(userId: number, fileId: number): Promise<TagApi[]> {
  if (!userId) {
    throw new MissingFieldError("Missing user ID.");
  }
  const [rows] = (await pool.query(
    `
      SELECT tags.*
      FROM tags
      JOIN files_tags ON tags.id = files_tags.tags_id
      JOIN files ON files.id = files_tags.files_id
      WHERE files.id = ? AND tags.user_id = ?
    `,
    [fileId, userId]
  )) as unknown as [RowDataPacket[]];

  if (rows.length === 0) {
    throw new RessourceNotFoundError("Tags not found.");
  }

  const tags: TagApi[] = rows.map((row) => {
    return {
      id: row.id,
      tag: row.tag,
      created_at: row.created_at,
      user_id: row.user_id,
    };
  });

  if (tags.some((tag) => !isTagApi(tag))) {
    throw new WrongTypeError("Data is not of type Tag");
  }

  return tags;
}

// ### getTagById ###
async function getTagById(
  userId: number,
  fileId: number,
  tagId: number
): Promise<TagApi> {
  if (!userId || !fileId || !tagId) {
    throw new MissingFieldError("Missing fields.");
  }
  const [rows] = (await pool.query(
    `
      SELECT tags.*
      FROM tags
      JOIN files_tags ON tags.id = files_tags.tags_id
      JOIN files ON files.id = files_tags.files_id
      WHERE files.id = ? AND tags.user_id = ? AND tags.id = ?
    `,
    [fileId, userId, tagId]
  )) as unknown as RowDataPacket[];

  if (rows.length === 0) {
    throw new RessourceNotFoundError("Tag not found.");
  }

  const data = rows[0];

  const tag: TagApi = {
    id: data.id,
    tag: data.tag,
    created_at: data.created_at,
    user_id: data.user_id,
  };

  if (!isTagApi(tag)) {
    throw new WrongTypeError("Data is not of type Tag");
  }

  return tag;
}

// ### createTag ###
async function createTag(
  userId: number,
  fileId: number,
  tagName: string
): Promise<TagApi> {
  if (!userId || !fileId || !tagName) {
    throw new MissingFieldError("Missing fields.");
  }

  // Check if the tag already exists
  const [existingTagRows] = (await pool.query(
    `
    SELECT * FROM tags
    WHERE tag = ? AND user_id = ?
  `,
    [tagName, userId]
  )) as RowDataPacket[];

  let tagId;
  if (existingTagRows.length > 0) {
    // If the tag exists, use its id
    tagId = existingTagRows[0].id;
  } else {
    // If not, insert into tags table
    const [tagRows] = (await pool.query(
      `
      INSERT INTO tags (tag, user_id)
      VALUES (?, ?)
    `,
      [tagName, userId]
    )) as ResultSetHeader[];

    tagId = tagRows.insertId;
  }

  // Check if the association between the tag and the file already exists in the files_tags table
  const [existingAssociationRows] = (await pool.query(
    `
    SELECT * FROM files_tags
    WHERE files_id = ? AND tags_id = ?
  `,
    [fileId, tagId]
  )) as RowDataPacket[];

  if (existingAssociationRows.length === 0) {
    // If the association does not exist, create it
    await pool.query(
      `
      INSERT INTO files_tags (files_id, tags_id)
      VALUES (?, ?)
    `,
      [fileId, tagId]
    );
  }

  const newTag = getTagById(userId, fileId, tagId);

  return newTag;
}

// ### deleteTag ###
async function deleteTag(
  userId: number,
  fileId: number,
  tagId: number
): Promise<void> {
  if (!userId || !fileId || !tagId) {
    throw new MissingFieldError("Missing fields.");
  }

  // Delete the tag's association with the file from the files_tags table
  const [associationRows] = (await pool.query(
    `
      DELETE FROM files_tags
      WHERE files_id = ? AND tags_id = ?
    `,
    [fileId, tagId]
  )) as ResultSetHeader[];

  // Check if the tag is associated with any other files
  const [tagRows] = (await pool.query(
    `
      SELECT * FROM files_tags
      WHERE tags_id = ?
    `,
    [tagId]
  )) as RowDataPacket[];

  // If the tag is not associated with any other files, delete it from the tags table
  if (tagRows.length === 0) {
    await pool.query(
      `
        DELETE FROM tags
        WHERE id = ? AND user_id = ?
      `,
      [tagId, userId]
    );
  }

  const affectedRows = associationRows.affectedRows;

  if (affectedRows === 0) {
    throw new RessourceNotFoundError("Tag not found.");
  }
}

export { getTags, getTagById, createTag, deleteTag };
