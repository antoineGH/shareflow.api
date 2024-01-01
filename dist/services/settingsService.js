"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = void 0;
const database_1 = require("../database");
const utils_1 = require("../utils");
const utils_2 = require("./utils");
// ### getSettings ###
async function getSettings(userId) {
    if (!userId) {
        throw new utils_1.MissingFieldError("Missing user ID.");
    }
    const [rows] = (await database_1.pool.query("SELECT * FROM settings WHERE user_id = ?", [
        userId,
    ]));
    if (rows.length === 0) {
        throw new utils_1.RessourceNotFoundError("Settings not found.");
    }
    const data = rows[0];
    const settings = {
        storage: {
            storage_used: data.storage_used,
            total_storage: data.total_storage,
        },
    };
    if (!(0, utils_2.isSettingsApi)(settings)) {
        throw new utils_1.WrongTypeError("Data is not of type Settings");
    }
    return settings;
}
exports.getSettings = getSettings;
