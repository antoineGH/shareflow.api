"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActionIds = exports.groupByFileId = exports.isFileApi = exports.isSettingsApi = exports.isActivityApi = exports.isUserApi = exports.isTagApi = exports.isCommentApi = void 0;
function isCommentApi(obj) {
    return (obj &&
        typeof obj.id === "number" &&
        typeof obj.comment === "string" &&
        obj.created_at instanceof Date &&
        obj.updated_at instanceof Date &&
        typeof obj.file_id === "number" &&
        typeof obj.user_id === "number");
}
exports.isCommentApi = isCommentApi;
function isTagApi(obj) {
    return (obj &&
        typeof obj.id === "number" &&
        typeof obj.tag === "string" &&
        obj.created_at instanceof Date &&
        typeof obj.user_id === "number");
}
exports.isTagApi = isTagApi;
function isUserApi(obj) {
    return (obj &&
        typeof obj.id === "number" &&
        typeof obj.full_name === "string" &&
        typeof obj.email === "string" &&
        (typeof obj.avatar_url === "string" ||
            obj.avatar_url === undefined ||
            obj.avatar_url === null) &&
        obj.created_at instanceof Date);
}
exports.isUserApi = isUserApi;
function isActivityApi(obj) {
    return (obj &&
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
        obj.updated_at instanceof Date);
}
exports.isActivityApi = isActivityApi;
function isSettingsApi(obj) {
    return (obj &&
        typeof obj.storage === "object" &&
        typeof obj.storage.storage_used === "number" &&
        typeof obj.storage.total_storage === "number");
}
exports.isSettingsApi = isSettingsApi;
function isFileApi(obj) {
    return (obj &&
        typeof obj.id === "number" &&
        typeof obj.name === "string" &&
        typeof obj.size === "string" &&
        typeof obj.path === "string" &&
        typeof obj.is_favorite === "number" &&
        typeof obj.is_deleted === "number" &&
        obj.created_at instanceof Date &&
        obj.updated_at instanceof Date &&
        Array.isArray(obj.actions) &&
        obj.actions.every((action) => typeof action === "string"));
}
exports.isFileApi = isFileApi;
function groupByFileId(rows) {
    return rows.reduce((acc, row) => {
        if (!acc[row.id]) {
            acc[row.id] = {
                ...row,
                actions: row.actions ? [row.actions] : [],
            };
        }
        else {
            if (row.actions && !acc[row.id].actions.includes(row.actions)) {
                acc[row.id].actions.push(row.actions);
            }
        }
        return acc;
    }, {});
}
exports.groupByFileId = groupByFileId;
function getActionIds(isFolder, isDeleted) {
    const actionIds = [];
    // 1 - download
    // 2 - comments
    // 3 - tags
    // 5 - rename
    // 6 - delete
    // 7 - restore
    // 8 - remove
    if (isDeleted) {
        // If the file is deleted, add the 'restore' and 'remove' actions
        actionIds.push(7, 8);
    }
    else {
        // If the file is not deleted, add the 'comments', 'tags', 'rename', and 'delete' actions
        actionIds.push(2, 3, 5, 6);
        // If the file is not a folder, add the 'download' action
        if (!isFolder) {
            actionIds.push(1);
        }
    }
    return actionIds;
}
exports.getActionIds = getActionIds;
