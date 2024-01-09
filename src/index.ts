import express, { type Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

// app env variables
dotenv.config();

// init express app
const app: Express = express();

// using dependancies
app.use(helmet());
app.use(
  cors({
    origin: "https://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Expose-Headers", "Content-Disposition");
  next();
});

export default app;
