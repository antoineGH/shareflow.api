import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../database";
import {
  MissingFieldError,
  RessourceNotFoundError,
  WrongTypeError,
} from "../utils";
import type { UserApi } from "../types/users";
import { isUserApi } from "./utils";

async function getUserById(userId: number): Promise<UserApi> {
  if (!userId) {
    throw new MissingFieldError("Missing user ID.");
  }

  const [rows] = (await pool.query("SELECT * FROM users WHERE id = ?", [
    userId,
  ])) as unknown as [RowDataPacket[]];

  if (rows.length === 0) {
    throw new RessourceNotFoundError("User not found.");
  }

  const data = rows[0];

  const user: UserApi = {
    id: data.id,
    full_name: data.full_name,
    email: data.email,
    avatar_url: data.avatar_url,
    created_at: data.created_at,
  };

  if (!isUserApi(user)) {
    throw new WrongTypeError("Data is not of type User");
  }

  return user;
}

async function updateUser(
  userId: number,
  full_name: string,
  email: string,
  avatar_url?: string
): Promise<void> {
  if (!userId || !full_name || !email) {
    throw new MissingFieldError("Missing fields.");
  }

  const [result] = (await pool.query("UPDATE users SET ? WHERE id = ?", [
    { full_name, email, avatar_url },
    userId,
  ])) as ResultSetHeader[];

  if (result.affectedRows === 0) {
    throw new RessourceNotFoundError("User not found.");
  }
}

async function updatePassword(userId: number, password: string): Promise<void> {
  if (!userId || !password) {
    throw new MissingFieldError("Missing fields.");
  }
  const [result] = (await pool.query(
    "UPDATE users SET password = ? WHERE id = ?",
    [password, userId]
  )) as ResultSetHeader[];

  if (result.affectedRows === 0) {
    throw new RessourceNotFoundError("User not found.");
  }
}

export { getUserById, updatePassword, updateUser };
