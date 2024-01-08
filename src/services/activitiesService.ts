import { pool } from "../database";
import type { RowDataPacket } from "mysql2";
import type { ActivityApi } from "../types/activities";
import {
  RessourceNotFoundError,
  WrongTypeError,
  MissingFieldError,
} from "../utils";
import { isActivityApi } from "./utils";

// ### getActivities ###
async function getActivities(fileId: number): Promise<ActivityApi[]> {
  if (!fileId) {
    throw new MissingFieldError("Error, missing file ID");
  }

  const [rows] = (await pool.query(
    `
          SELECT activities.*, users.full_name, users.email, users.avatar_url
          FROM activities
          JOIN users ON activities.user_id = users.id
          WHERE file_id = ?
      `,
    [fileId]
  )) as unknown as [RowDataPacket[]];

  if (rows.length === 0) {
    return [];
  }

  const activities: ActivityApi[] = rows.map((row) => {
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

  if (activities.some((activity) => !isActivityApi(activity))) {
    throw new WrongTypeError("Error, data is not of type activity");
  }

  return activities;
}

// ### getActivityById ###
async function getActivityById(
  fileId: number,
  activityId: number
): Promise<ActivityApi> {
  if (!fileId || !activityId) {
    throw new MissingFieldError("Error, missing fields");
  }

  const [rows] = (await pool.query(
    `
    SELECT activities.*, users.full_name, users.email, users.avatar_url
    FROM activities
    JOIN users ON activities.user_id = users.id
    WHERE file_id = ? and activities.id = ?
    `,
    [fileId, activityId]
  )) as unknown as RowDataPacket[];

  if (rows.length === 0) {
    throw new RessourceNotFoundError("Activity not found.");
  }

  const data = rows[0];

  const activity: ActivityApi = {
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

  if (!isActivityApi(activity)) {
    throw new WrongTypeError("Error, data is not of type activity");
  }

  return activity;
}

// ### createActivity ###
async function createActivity(
  userId: number,
  fileId: number,
  activity: string
): Promise<ActivityApi> {
  if (!fileId || !activity) {
    throw new MissingFieldError("Error, missing fields");
  }

  const [result] = (await pool.query(
    `
        INSERT INTO activities ( activity, file_id, user_id)
            VALUES (?, ?, ?)
    `,
    [activity, fileId, userId]
  )) as RowDataPacket[];

  const activityId = result.insertId;
  const newActivity = await getActivityById(fileId, activityId);

  return newActivity;
}

export { getActivities, createActivity };
