import { pool } from "../database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { RowDataPacket } from "mysql2";
import {
  AuthenticationError,
  MissingFieldError,
  RessourceNotFoundError,
} from "../utils";

async function authenticateUser(
  email: string,
  password: string
): Promise<string> {
  if (!email || !password) {
    throw new MissingFieldError("Error, missing fields");
  }

  const [rows] = (await pool.query(
    `
    SELECT * FROM users WHERE email = ?
    `,
    [email]
  )) as unknown as RowDataPacket[];

  if (rows.length === 0) {
    throw new RessourceNotFoundError("Error, user not found");
  }

  const user = rows[0];

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new AuthenticationError("Error, incorrect password");
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

  return token;
}

export { authenticateUser };
