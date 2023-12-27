import express from "express";
import dotenv from "dotenv";
import { getUsers } from "./database";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
};
app.use(errorHandler);
app.get("/", (req, res) => {
    res.send("Node + Express + TypeScript Server");
});
app.get("/users", async (req, res) => {
    const users = await getUsers();
    res.send(users);
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
