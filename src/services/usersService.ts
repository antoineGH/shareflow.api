import { pool } from "../database";
import type { ResultSetHeader } from "mysql2";

async function getUsers() {
  const users = await pool.query("SELECT * FROM users");
  return users[0];
}

async function getUserById(id: number) {
  const user = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return user[0];
}

async function createUser(
  full_name: string,
  email: string,
  avatar_url?: string
) {
  try {
    const [user] = (await pool.query(
      "INSERT INTO users (full_name, email, avatar_url) VALUES (?, ?, ?)",
      [full_name, email, avatar_url]
    )) as ResultSetHeader[];

    const id = user.insertId;
    return getUserById(id);
  } catch (err) {
    console.error(err);
    throw new Error("An error occurred while creating the user.");
  }
}

export { getUsers, getUserById, createUser };
