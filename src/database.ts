import type { ResultSetHeader } from "mysql2";
import { pool } from ".";

async function getUsers() {
  const users = await pool.query("SELECT * FROM users");
  return users[0];
}

async function getUserById(id: number) {
  const user = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return user[0];
}

async function createUser(name: string, email: string) {
  const [user] = (await pool.query(
    "INSERT INTO users (full_name, email) VALUES (?, ?)",
    [name, email]
  )) as ResultSetHeader[];

  const id = user.insertId;
  return getUserById(id);
}

export { getUsers, getUserById, createUser };
// "dev": "npm run tsc:w",
