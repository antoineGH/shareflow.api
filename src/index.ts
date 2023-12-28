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
app.use(cors());
app.use(express.json());

export default app;
