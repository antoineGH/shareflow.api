import type { TagApi } from "../types/tags";
import type { CommentApi } from "../types/comments";

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

export { isCommentApi, isTagApi };
