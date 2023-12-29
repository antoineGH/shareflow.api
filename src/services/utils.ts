import type { TagApi } from "../types/tags";
import type { CommentApi } from "../types/comments";
import type { UserApi } from "../types/users";

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

export { isCommentApi, isTagApi, isUserApi };
