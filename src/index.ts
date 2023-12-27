import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2";
import type { Express, Request, Response, NextFunction } from "express";
import { getUsers } from "./database";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

console.log(process.env.MYSQL_HOST);
console.log(process.env.MYSQL_USER);
console.log(process.env.MYSQL_PASSWORD);
console.log(process.env.MYSQL_DATABASE);

export const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
};

app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send("Node + Express + TypeScript Server");
});

app.get("/users", async (req: Request, res: Response) => {
  const users = await getUsers();
  res.send(users);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
