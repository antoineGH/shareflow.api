import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../database";
import {
  MissingFieldError,
  RessourceNotFoundError,
  WrongTypeError,
} from "../utils";
import { isTagApi } from "./utils";
import type { TagApi } from "../types/tags";

// TODO: GET TAGS PROBLEM NO TAGS PROPOSED IN THE LIST
// TODO: ERROR DELETE TAG
// ### getTags ###
async function getTags(
  userId: number,
  fileId?: number,
  search?: string
): Promise<TagApi[]> {
  if (!userId) {
    throw new MissingFieldError("Error, missing user ID");
  }
  let query = `
    SELECT tags.*
    FROM tags
    LEFT JOIN files_tags ON tags.id = files_tags.tags_id
    WHERE tags.user_id = $1
  `;
  let queryParams: (string | number)[] = [userId];
  let paramIndex = 2;

  if (fileId && fileId !== -1) {
    query += ` AND files_tags.files_id = $${paramIndex++}`;
    queryParams.push(fileId);
  }

  if (search) {
    query += ` AND tags.tag LIKE $${paramIndex++}`;
    queryParams.push(`%${search}%`);
  }

  const { rows } = await pool.query(query, queryParams);

  if (rows.length === 0) {
    return [];
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
    throw new WrongTypeError("Error, data is not of type tag");
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
    throw new MissingFieldError("Error, missing fields");
  }
  const { rows } = await pool.query(
    `
      SELECT tags.*
      FROM tags
      JOIN files_tags ON tags.id = files_tags.tags_id
      JOIN files ON files.id = files_tags.files_id
      WHERE files.id = $1 AND tags.user_id = $2 AND tags.id = $3
    `,
    [fileId, userId, tagId]
  );

  if (rows.length === 0) {
    throw new RessourceNotFoundError("Error, tag not found");
  }

  const data = rows[0];

  const tag: TagApi = {
    id: data.id,
    tag: data.tag,
    created_at: data.created_at,
    user_id: data.user_id,
  };

  if (!isTagApi(tag)) {
    throw new WrongTypeError("Error, data is not of type tag");
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
    throw new MissingFieldError("Error, missing fields");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    // Check if the tag already exists
    const { rows: existingTagRows } = await client.query(
      `
      SELECT * FROM tags
      WHERE tag = $1 AND user_id = $2
      `,
      [tagName, userId]
    );

    let tagId;
    if (existingTagRows.length > 0) {
      // If the tag exists, use its id
      tagId = existingTagRows[0].id;
    } else {
      // If not, insert into tags table
      const { rows: tagRows } = await client.query(
        `
        INSERT INTO tags (tag, user_id)
        VALUES ($1, $2)
        RETURNING id
        `,
        [tagName, userId]
      );

      tagId = tagRows[0].id;
    }

    // Check if the association between the tag and the file already exists in the files_tags table
    const { rows: existingAssociationRows } = await client.query(
      `
      SELECT * FROM files_tags
      WHERE files_id = $1 AND tags_id = $2
      `,
      [fileId, tagId]
    );

    if (existingAssociationRows.length === 0) {
      // If the association does not exist, create it
      await client.query(
        `
        INSERT INTO files_tags (files_id, tags_id)
        VALUES ($1, $2)
        `,
        [fileId, tagId]
      );
    }

    // ## insert entry in activities table ##
    const activityDescription = `${tagName} tag added`;
    await client.query(
      "INSERT INTO activities (activity, file_id, user_id) VALUES ($1, $2, $3)",
      [activityDescription, fileId, userId]
    );

    await client.query("COMMIT");

    const newTag = getTagById(userId, fileId, tagId);

    return newTag;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// ### deleteTag ###
async function deleteTag(
  userId: number,
  fileId: number,
  tagId: number
): Promise<void> {
  if (!userId || !fileId || !tagId) {
    throw new MissingFieldError("Error, missing fields");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const associationResult = await client.query(
      "DELETE FROM files_tags WHERE files_id = $1 AND tags_id = $2",
      [fileId, tagId]
    );

    const tagResult = await client.query(
      "SELECT * FROM files_tags WHERE tags_id = $1",
      [tagId]
    );

    const tag = await getTagById(userId, fileId, tagId);
    const tagName = tag.tag;

    if (tagResult.rows.length === 0) {
      await client.query("DELETE FROM tags WHERE id = $1 AND user_id = $2", [
        tagId,
        userId,
      ]);
    }

    const affectedRows = associationResult.rowCount;

    if (affectedRows === 0) {
      throw new RessourceNotFoundError("Error, tag not found");
    }

    // ## insert entry in activities table ##
    const activityDescription = `${tagName} tag removed`;
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

export { getTags, getTagById, createTag, deleteTag };
