import type { ResultSetHeader } from "mysql2";
import { pool } from "../database";
import { MissingFieldError, throwError } from "../utils";

async function getUsers() {
  try {
    const users = await pool.query("SELECT * FROM users");
    return users[0];
  } catch (err) {
    throwError(err);
  }
}

async function getUserById(userId: number) {
  try {
    if (!userId) {
      throw new MissingFieldError("Missing user ID.");
    }
    const user = await pool.query("SELECT * FROM users WHERE id = ?", [userId]);
    return user[0];
  } catch (err) {
    throwError(err);
  }
}

async function updateUser(
  userId: number,
  full_name: string,
  email: string,
  avatar_url?: string
) {
  try {
    const user = await pool.query("UPDATE users SET ? WHERE id = ?", [
      userId,
      { full_name, email, avatar_url },
    ]);
    return user[0];
  } catch (err) {
    throwError(err);
  }
}

async function updatePassword(userId: number, password: string) {
  try {
    if (!userId || !password) {
      throw new MissingFieldError("Missing fields.");
    }
    const user = await pool.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [password, userId]
    );
    return user[0];
  } catch (err) {
    throwError(err);
  }
}

async function createUser(
  full_name: string,
  email: string,
  password: string,
  avatar_url?: string
) {
  try {
    if (!full_name || !email || !password) {
      throw new MissingFieldError("Missing fields.");
    }
    const [user] = (await pool.query(
      "INSERT INTO users (full_name, email, password, avatar_url) VALUES (?, ?, ?, ?)",
      [full_name, email, password, avatar_url]
    )) as ResultSetHeader[];

    const id = user.insertId;
    return getUserById(id);
  } catch (err) {
    throwError(err);
  }
}

export { getUsers, getUserById, updatePassword, updateUser, createUser };
