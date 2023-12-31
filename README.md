# Table of Contents

- [shareflow.api](#shareflowapi)
- [Users](#users)
  - [GET /users/:userId](#get-usersuserid)
  - [PUT /users/:userId](#put-usersuserid)
  - [PATCH /users/:userId/password](#patch-usersuseridpassword)
- [Tags](#tags)
  - [GET /users/:userId/files/:fileId/tags/](#get-usersuseridfilesfileidtags)
  - [GET /users/:userId/files/:fileId/tags/:tagId](#get-usersuseridfilesfileidtagstagid)
  - [POST /users/:userId/files/:fileId/tags](#post-usersuseridfilesfileidtags)
  - [DELETE /users/:userId/files/:fileId/tags/:tagId](#delete-usersuseridfilesfileidtagstagid)
- [Settings](#settings)
  - [GET /users/:userId/settings](#get-usersuseridsettings)
- [Comments](#comments)
  - [GET /users/:userId/files/:fileId/comments](#get-usersuseridfilesfileidcomments)
  - [GET /users/:userId/files/:fileId/comments/:commentId](#get-usersuseridfilesfileidcommentscommentid)
  - [POST /users/:userId/files/:fileId/comments/](#post-usersuseridfilesfileidcomments)
  - [DELETE /users/:userId/files/:fileId/comments/:commentId](#delete-usersuseridfilesfileidcommentscommentid)
- [Activities](#activities)
  - [GET /users/:userId/files/:fileId/activities](#get-usersuseridfilesfileidactivities)
  - [POST /users/:userId/files/:fileId/activities](#post-usersuseridfilesfileidactivities)
- [Files](#files)
  - [GET /users/:userId/files](#get-usersuseridfiles)
  - [GET /users/:userId/files/:fileId](#get-usersuseridfilesfileid)
  - [POST /users/:userId/files](#post-usersuseridfiles)
  - [PUT /users/:userId/files/:fileId](#put-usersuseridfilesfileid)
  - [PATCH /users/:userId/files/:fileId](#patch-usersuseridfilesfileid)
  - [DELETE /users/:userId/files/:fileId](#delete-usersuseridfilesfileid)

# Users

### GET /users/:userId

Fetches a specific user by their ID.

**Parameters:**

- `userId`: The ID of the user.

**Response:** The requested user.

**Status Code:** 200 OK

---

### PUT /users/:userId

Updates a specific user's details.

**Parameters:**

- `userId`: The ID of the user.
- `full_name`, `email`, `avatar_url`: The updated user details (in the request body).

**Response:** No content.

**Status Code:** 204 No Content

---

### PATCH /users/:userId/password

Updates a specific user's password.

**Parameters:**

- `userId`: The ID of the user.
- `password`: The new password (in the request body).

**Response:** No content.

**Status Code:** 204 No Content

# Tags

### GET /users/:userId/files/:fileId/tags/

Fetches all tags associated with a specific file for a user.

**Parameters:**

- `userId`: The ID of the user.
- `fileId`: The ID of the file.

**Response:** An array of tags.

**Status Code:** 200 OK

**Implementation:** Implemented in the `getTags` function in the `tagsService` module.

---

### GET /users/:userId/files/:fileId/tags/:tagId

Fetches a specific tag associated with a specific file for a user.

**Parameters:**

- `userId`: The ID of the user.
- `fileId`: The ID of the file.
- `tagId`: The ID of the tag.

**Response:** The requested tag.

**Status Code:** 200 OK

**Implementation:** Implemented in the `getTagById` function in the `tagsService` module.

---

### POST /users/:userId/files/:fileId/tags

Creates a new tag associated with a specific file for a user.

**Parameters:**

- `userId`: The ID of the user.
- `fileId`: The ID of the file.
- `tag`: The tag to be created.

**Response:** The created tag.

**Status Code:** 201 Created

**Implementation:** Implemented in the `createTag` function in the `tagsService` module.

---

### DELETE /users/:userId/files/:fileId/tags/:tagId

Deletes a specific tag associated with a specific file for a user.

**Parameters:**

- `userId`: The ID of the user.
- `fileId`: The ID of the file.
- `tagId`: The ID of the tag.

**Response:** No content.

**Status Code:** 204 No Content

**Implementation:** Implemented in the `deleteTag` function in the `tagsService` module.

# Settings

### GET /users/:userId/settings

Fetches the settings for a specific user.

**Parameters:**

- `userId`: The ID of the user.

**Response:** The requested user's settings.

**Status Code:** 200 OK

# Comments

### GET /users/:userId/files/:fileId/comments

Fetches all comments associated with a specific file for a user.

**Parameters:**

- `userId`: The ID of the user.
- `fileId`: The ID of the file.

**Response:** An array of comments.

**Status Code:** 200 OK

---

### GET /users/:userId/files/:fileId/comments/:commentId

Fetches a specific comment associated with a specific file for a user.

**Parameters:**

- `userId`: The ID of the user.
- `fileId`: The ID of the file.
- `commentId`: The ID of the comment.

**Response:** The requested comment.

**Status Code:** 200 OK

---

### POST /users/:userId/files/:fileId/comments/

Creates a new comment associated with a specific file for a user.

**Parameters:**

- `userId`: The ID of the user.
- `fileId`: The ID of the file.
- `comment`: The content of the comment (in the request body).

**Response:** The created comment.

**Status Code:** 201 Created

---

### DELETE /users/:userId/files/:fileId/comments/:commentId

Deletes a specific comment associated with a specific file for a user.

**Parameters:**

- `userId`: The ID of the user.
- `fileId`: The ID of the file.
- `commentId`: The ID of the comment.

**Response:** No content.

**Status Code:** 204 No Content

# Activities

### GET /users/:userId/files/:fileId/activities

Fetches all activities associated with a specific file for a user.

**Parameters:**

- `userId`: The ID of the user.
- `fileId`: The ID of the file.

**Response:** An array of activities.

**Status Code:** 200 OK if the activities are fetched successfully, 500 Internal Server Error if an error occurred.

---

### POST /users/:userId/files/:fileId/activities

Creates a new activity associated with a specific file for a user.

**Parameters:**

- `userId`: The ID of the user.
- `fileId`: The ID of the file.
- `activity`: The activity to be created (in the request body).

**Response:** The created activity.

**Status Code:** 201 Created if the activity is created successfully, 500 Internal Server Error if an error occurred.

# Files

## Endpoints

### GET /users/:userId/files

Fetches all files associated with a specific user, with optional filters and tags.

**Parameters:**

- `userId`: The ID of the user.
- `tags`: An optional comma-separated list of tags to filter by.
- `is_favorite`: An optional filter for whether the file is a favorite.
- `is_deleted`: An optional filter for whether the file is deleted.
- `all_files`: An optional filter for whether to return all files.

**Response:** An array of files.

**Status Code:** 200 OK

---

### GET /users/:userId/files/:fileId

Fetches a specific file associated with a specific user.

**Parameters:**

- `userId`: The ID of the user.
- `fileId`: The ID of the file.

**Response:** The requested file.

**Status Code:** 200 OK

---

### POST /users/:userId/files

Creates a new file associated with a specific user.

**Parameters:**

- `userId`: The ID of the user.
- `file`: The file to be created, including the following properties:
  - `name`: The name of the file.
  - `size`: The size of the file.
  - `path`: The path of the file.
  - `is_folder`: Whether the file is a folder.
  - `is_favorite`: Whether the file is a favorite.
  - `is_deleted`: Whether the file is deleted.

**Response:** The created file.

**Status Code:** 201 Created

---

### PUT /users/:userId/files/:fileId

Updates a specific file associated with a specific user.

**Parameters:**

- `userId`: The ID of the user.
- `fileId`: The ID of the file.
- `file`: The file to be updated, including the following properties:
  - `name`: The name of the file.
  - `size`: The size of the file.
  - `path`: The path of the file.
  - `is_folder`: Whether the file is a folder.
  - `is_favorite`: Whether the file is a favorite.
  - `is_deleted`: Whether the file is deleted.

**Response:** The updated file.

**Status Code:** 200 OK

---

### PATCH /users/:userId/files/:fileId

Partially updates a specific file associated with a specific user. Can be used to toggle favorite/non favorite or delete/restore.

**Parameters:**

- `userId`: The ID of the user.
- `fileId`: The ID of the file.
- `file`: The file to be updated, including the following properties:
  - `name`: The name of the file.
  - `size`: The size of the file.
  - `path`: The path of the file.
  - `is_folder`: Whether the file is a folder.
  - `is_favorite`: Whether the file is a favorite.
  - `is_deleted`: Whether the file is deleted.

**Response:** The updated file.

**Status Code:** 200 OK

---

### DELETE /users/:userId/files/:fileId

Deletes a specific file associated with a specific user.

**Parameters:**

- `userId`: The ID of the user.
- `fileId`: The ID of the file.

**Response:** No content.

**Status Code:** 204 No Content
