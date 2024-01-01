"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActivity = exports.getActivities = void 0;
const database_1 = require("../database");
const utils_1 = require("../utils");
const utils_2 = require("./utils");
// ### getActivities ###
async function getActivities(fileId) {
    if (!fileId) {
        throw new utils_1.MissingFieldError("Missing file ID.");
    }
    const [rows] = (await database_1.pool.query(`
          SELECT activities.*, users.full_name, users.email, users.avatar_url
          FROM activities
          JOIN users ON activities.user_id = users.id
          WHERE file_id = ?
      `, [fileId]));
    if (rows.length === 0) {
        throw new utils_1.RessourceNotFoundError("Activities not found.");
    }
    const activities = rows.map((row) => {
        return {
            id: row.id,
            user: {
                full_name: row.full_name,
                email: row.email,
                avatar_url: row.avatar_url,
            },
            file_id: row.file_id,
            activity: row.activity,
            created_at: row.created_at,
            updated_at: row.updated_at,
        };
    });
    if (activities.some((activity) => !(0, utils_2.isActivityApi)(activity))) {
        throw new utils_1.WrongTypeError("Data is not of type Activity");
    }
    return activities;
}
exports.getActivities = getActivities;
// ### getActivityById ###
async function getActivityById(fileId, activityId) {
    if (!fileId || !activityId) {
        throw new utils_1.MissingFieldError("Missing fields.");
    }
    const [rows] = (await database_1.pool.query(`
    SELECT activities.*, users.full_name, users.email, users.avatar_url
    FROM activities
    JOIN users ON activities.user_id = users.id
    WHERE file_id = ? and activities.id = ?
    `, [fileId, activityId]));
    if (rows.length === 0) {
        throw new utils_1.RessourceNotFoundError("Activity not found.");
    }
    const data = rows[0];
    const activity = {
        id: data.id,
        user: {
            full_name: data.full_name,
            email: data.email,
            avatar_url: data.avatar_url,
        },
        file_id: data.file_id,
        activity: data.activity,
        created_at: data.created_at,
        updated_at: data.updated_at,
    };
    if (!(0, utils_2.isActivityApi)(activity)) {
        throw new utils_1.WrongTypeError("Data is not of type Activity");
    }
    return activity;
}
// ### createActivity ###
async function createActivity(userId, fileId, activity) {
    if (!fileId || !activity) {
        throw new utils_1.MissingFieldError("Missing fields.");
    }
    const [result] = (await database_1.pool.query(`
        INSERT INTO activities ( activity, file_id, user_id)
            VALUES (?, ?, ?)
    `, [activity, fileId, userId]));
    const activityId = result.insertId;
    const newActivity = await getActivityById(fileId, activityId);
    return newActivity;
}
exports.createActivity = createActivity;
