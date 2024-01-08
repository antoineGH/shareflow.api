import type { TagApi } from "../types/tags";
import type { CommentApi } from "../types/comments";
import type { UserApi } from "../types/users";
import type { ActivityApi } from "../types/activities";
import type { SettingsApi } from "../types/settings";
import type { FileApi } from "../types/files";

function isCommentApi(obj: any): obj is CommentApi {
  return (
    obj &&
    typeof obj.id === "number" &&
    typeof obj.comment === "string" &&
    obj.created_at instanceof Date &&
    obj.updated_at instanceof Date &&
    typeof obj.file_id === "number" &&
    obj.user &&
    typeof obj.user.user_id === "number" &&
    typeof obj.user.full_name === "string" &&
    typeof obj.user.avatar_url === "string"
  );
}

function isTagApi(obj: any): obj is TagApi {
  return (
    obj &&
    typeof obj.id === "number" &&
    typeof obj.tag === "string" &&
    obj.created_at instanceof Date &&
    typeof obj.user_id === "number"
  );
}

function isUserApi(obj: any): obj is UserApi {
  return (
    obj &&
    typeof obj.id === "number" &&
    typeof obj.full_name === "string" &&
    typeof obj.email === "string" &&
    (typeof obj.avatar_url === "string" ||
      obj.avatar_url === undefined ||
      obj.avatar_url === null) &&
    obj.created_at instanceof Date
  );
}

function isActivityApi(obj: any): obj is ActivityApi {
  return (
    obj &&
    typeof obj.id === "number" &&
    typeof obj.user === "object" &&
    typeof obj.user.full_name === "string" &&
    typeof obj.user.email === "string" &&
    (typeof obj.user.avatar_url === "string" ||
      obj.user.avatar_url === undefined ||
      obj.user.avatar_url === null) &&
    typeof obj.file_id === "number" &&
    typeof obj.activity === "string" &&
    obj.created_at instanceof Date &&
    obj.updated_at instanceof Date
  );
}

function isSettingsApi(obj: any): obj is SettingsApi {
  return (
    obj &&
    typeof obj.storage === "object" &&
    typeof obj.storage.storage_used === "number" &&
    typeof obj.storage.total_storage === "number"
  );
}

function isFileApi(obj: any): obj is FileApi {
  return (
    obj &&
    typeof obj.id === "number" &&
    typeof obj.name === "string" &&
    typeof obj.size === "string" &&
    typeof obj.path === "string" &&
    typeof obj.is_favorite === "number" &&
    typeof obj.is_deleted === "number" &&
    obj.created_at instanceof Date &&
    obj.updated_at instanceof Date &&
    Array.isArray(obj.actions) &&
    obj.actions.every((action) => typeof action === "string")
  );
}

function groupByFileId(rows: any[]): Record<string, any> {
  return rows.reduce((acc, row) => {
    if (!acc[row.id]) {
      acc[row.id] = {
        ...row,
        actions: row.actions ? [row.actions] : [],
      };
    } else {
      if (row.actions && !acc[row.id].actions.includes(row.actions)) {
        acc[row.id].actions.push(row.actions);
      }
    }

    return acc;
  }, {});
}

function getActionIds(isFolder: boolean, isDeleted: boolean): number[] {
  const actionIds: number[] = [];
  // 1|download|
  // 2|comments|
  // 3|tags    |
  // 4|rename  |
  // 5|delete  |
  // 6|restore |
  // 7|remove  |

  if (isDeleted) {
    // If the file is deleted, add the 'restore' and 'remove' actions
    actionIds.push(6, 7);
  } else {
    // If the file is not deleted, add the 'comments', 'tags', 'rename', and 'delete' actions
    actionIds.push(2, 3, 4, 5);

    // If the file is not a folder, add the 'download' action
    if (!isFolder) {
      actionIds.push(1);
    }
  }

  return actionIds;
}

function getFilePath(name: string) {
  // TODO: Update this function to get the file location on server
  return `/${name}`;
}

export {
  isCommentApi,
  isTagApi,
  isUserApi,
  isActivityApi,
  isSettingsApi,
  isFileApi,
  groupByFileId,
  getActionIds,
  getFilePath,
};
