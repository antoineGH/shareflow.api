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

  const query = `
    SELECT activities.*, users.full_name, users.email, users.avatar_url
    FROM activities
    JOIN users ON activities.user_id = users.id
    WHERE file_id = $1
  `;
  const values = [fileId];

  try {
    const { rows } = await pool.query(query, values);

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
  } catch (error) {
    throw error;
  }
}

// ### getActivityById ###
async function getActivityById(
  fileId: number,
  activityId: number
): Promise<ActivityApi> {
  if (!fileId || !activityId) {
    throw new MissingFieldError("Error, missing fields");
  }

  const query = `
    SELECT activities.*, users.full_name, users.email, users.avatar_url
    FROM activities
    JOIN users ON activities.user_id = users.id
    WHERE file_id = $1 AND activities.id = $2
  `;
  const values = [fileId, activityId];

  try {
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      throw new RessourceNotFoundError("Activity not found.");
    }

    const data = rows[0] as ActivityApi;

    if (!isActivityApi(data)) {
      throw new WrongTypeError("Error, data is not of type activity");
    }

    return data;
  } catch (error) {
    throw error;
  }
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

  const query = `
    INSERT INTO activities (activity, file_id, user_id)
    VALUES ($1, $2, $3)
    RETURNING id, activity, file_id, user_id, created_at;
  `;
  const values = [activity, fileId, userId];

  try {
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      throw new RessourceNotFoundError("Error, failed to create activity");
    }

    const newActivity = rows[0] as ActivityApi;

    if (!isActivityApi(newActivity)) {
      throw new WrongTypeError("Error, data is not of type activity");
    }

    return newActivity;
  } catch (error) {
    throw error;
  }
}

export { getActivities, createActivity };
