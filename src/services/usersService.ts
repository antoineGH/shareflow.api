import type { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
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
    throw new MissingFieldError("Error, missing user ID");
  }

  const query =
    "SELECT id, full_name, email, avatar_url, created_at FROM users WHERE id = $1";
  const values = [userId];

  try {
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      throw new RessourceNotFoundError("Error, user not found");
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
      throw new WrongTypeError("Error, data is not of type user");
    }

    return user;
  } catch (error) {
    throw error;
  }
}

async function updateUser(
  userId: number,
  full_name: string,
  email: string
): Promise<void> {
  if (!userId || !full_name || !email) {
    throw new MissingFieldError("Error, missing fields");
  }

  const query = "UPDATE users SET full_name = $1, email = $2 WHERE id = $3";
  const values = [full_name, email, userId];

  try {
    const { rowCount } = await pool.query(query, values);

    if (rowCount === 0) {
      throw new RessourceNotFoundError("Error, user not found");
    }
  } catch (error) {
    throw error;
  }
}

async function updatePassword(userId: number, password: string): Promise<void> {
  if (!userId || !password) {
    throw new MissingFieldError("Error, missing fields");
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const query = "UPDATE users SET password = $1 WHERE id = $2";
  const values = [hashedPassword, userId];

  try {
    const { rowCount } = await pool.query(query, values);

    if (rowCount === 0) {
      throw new RessourceNotFoundError("Error, user not found");
    }
  } catch (error) {
    throw error;
  }
}

export { getUserById, updatePassword, updateUser };
