import type { ResultSetHeader } from "mysql2";
import { pool } from "../database";
import { MissingFieldError, throwError } from "../utils";

async function getTags(userId: number) {
  try {
    if (!userId) {
      throw new MissingFieldError("Missing user ID.");
    }
    const tags = await pool.query("SELECT * FROM tags WHERE user_id = ?", [
      userId,
    ]);
    return tags[0];
  } catch (err) {
    throwError(err);
  }
}

async function getTagById(userId: number, tagId: number) {
  try {
    if (!userId || !tagId) {
      throw new MissingFieldError("Missing fields.");
    }
    const tag = await pool.query(
      "SELECT * FROM tags WHERE user_id = ? AND id = ?",
      [userId, tagId]
    );
    return tag[0];
  } catch (err) {
    throwError(err);
  }
}

async function deleteTag(userId: number, tagId: number): Promise<number> {
  try {
    if (!userId || !tagId) {
      throw new MissingFieldError("Missing fields.");
    }
    const [tag] = (await pool.query(
      "DELETE FROM tags WHERE user_id = ? AND id = ?",
      [userId, tagId]
    )) as ResultSetHeader[];

    const affectedRows = tag.affectedRows;
    return affectedRows;
  } catch (err) {
    throwError(err);
    return 0;
  }
}

export { getTags, getTagById, deleteTag };
