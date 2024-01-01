"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.updatePassword = exports.getUserById = void 0;
const database_1 = require("../database");
const utils_1 = require("../utils");
const utils_2 = require("./utils");
async function getUserById(userId) {
    if (!userId) {
        throw new utils_1.MissingFieldError("Missing user ID.");
    }
    const [rows] = (await database_1.pool.query("SELECT * FROM users WHERE id = ?", [
        userId,
    ]));
    if (rows.length === 0) {
        throw new utils_1.RessourceNotFoundError("User not found.");
    }
    const data = rows[0];
    const user = {
        id: data.id,
        full_name: data.full_name,
        email: data.email,
        avatar_url: data.avatar_url,
        created_at: data.created_at,
    };
    if (!(0, utils_2.isUserApi)(user)) {
        throw new utils_1.WrongTypeError("Data is not of type User");
    }
    return user;
}
exports.getUserById = getUserById;
async function updateUser(userId, full_name, email, avatar_url) {
    if (!userId || !full_name || !email) {
        throw new utils_1.MissingFieldError("Missing fields.");
    }
    const [result] = (await database_1.pool.query("UPDATE users SET ? WHERE id = ?", [
        { full_name, email, avatar_url },
        userId,
    ]));
    if (result.affectedRows === 0) {
        throw new utils_1.RessourceNotFoundError("User not found.");
    }
}
exports.updateUser = updateUser;
async function updatePassword(userId, password) {
    if (!userId || !password) {
        throw new utils_1.MissingFieldError("Missing fields.");
    }
    const [result] = (await database_1.pool.query("UPDATE users SET password = ? WHERE id = ?", [password, userId]));
    if (result.affectedRows === 0) {
        throw new utils_1.RessourceNotFoundError("User not found.");
    }
}
exports.updatePassword = updatePassword;
