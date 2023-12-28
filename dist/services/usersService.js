"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUserById = exports.getUsers = void 0;
const database_1 = require("src/database");
async function getUsers() {
    const users = await database_1.pool.query("SELECT * FROM users");
    return users[0];
}
exports.getUsers = getUsers;
async function getUserById(id) {
    const user = await database_1.pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return user[0];
}
exports.getUserById = getUserById;
async function createUser(full_name, email, avatar_url) {
    try {
        const [user] = (await database_1.pool.query("INSERT INTO users (full_name, email, avatar_url) VALUES (?, ?, ?)", [full_name, email, avatar_url]));
        const id = user.insertId;
        return getUserById(id);
    }
    catch (err) {
        console.error(err);
        throw new Error("An error occurred while creating the user.");
    }
}
exports.createUser = createUser;
