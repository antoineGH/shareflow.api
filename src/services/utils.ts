import type { TagApi } from "../types/tags";
import type { CommentApi } from "../types/comments";
import type { UserApi } from "../types/users";
import type { ActivityApi } from "../types/activities";
import type { SettingsApi } from "../types/settings";

function isCommentApi(obj: any): obj is CommentApi {
  return (
    obj &&
    typeof obj.id === "number" &&
    typeof obj.comment === "string" &&
    obj.created_at instanceof Date &&
    obj.updated_at instanceof Date &&
    typeof obj.file_id === "number" &&
    typeof obj.user_id === "number"
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

export { isCommentApi, isTagApi, isUserApi, isActivityApi, isSettingsApi };
