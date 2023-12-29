import { pool } from "../database";
import {
  MissingFieldError,
  RessourceNotFoundError,
  WrongTypeError,
} from "../utils";
import { isSettingsApi } from "./utils";
import type { SettingsApi } from "../types/settings";
import type { RowDataPacket } from "mysql2";

// ### getSettings ###
async function getSettings(userId: number): Promise<SettingsApi> {
  if (!userId) {
    throw new MissingFieldError("Missing user ID.");
  }
  const [rows] = (await pool.query("SELECT * FROM settings WHERE user_id = ?", [
    userId,
  ])) as unknown as [RowDataPacket[]];

  if (rows.length === 0) {
    throw new RessourceNotFoundError("Settings not found.");
  }

  const data = rows[0];

  const settings: SettingsApi = {
    storage: {
      storage_used: data.storage_used,
      total_storage: data.total_storage,
    },
  };

  if (!isSettingsApi(settings)) {
    throw new WrongTypeError("Data is not of type Settings");
  }

  return settings;
}

export { getSettings };
