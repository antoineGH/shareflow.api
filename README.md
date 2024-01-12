# Table of Contents

- [shareflow.api](#shareflowapi)
- [Users](#users)
- [Tags](#tags)
- [Settings](#settings)
- [Comments](#comments)
- [Activities](#activities)
- [Files](#files)

# Users

### GET /users/:userId

Fetches the user with the specified ID.

#### Parameters

- **userId:** The ID of the user.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Response

A user object.

- **Status Code:** 200 OK

#### Errors

If an error occurs, the response will include an error message. For example, if the userId is not found, a 404 status code will be returned with an error message. If the userId is missing, a 400 status code will be returned with an error message. If the data returned is not of the expected type, a 500 status code will be returned with an error message.

---

### PUT /users/:userId

Updates the user with the specified ID.

#### Parameters

- **userId:** The ID of the user.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Request Body

A user object.

#### Status Code

- 204 No Content

#### Errors

If an error occurs, the response will include an error message. For example, if the userId is not found, a 404 status code will be returned with an error message. If the userId or any of the fields in the request body are missing, a 400 status code will be returned with an error message. If the data returned is not of the expected type, a 500 status code will be returned with an error message.

---

### PATCH /users/:userId/password

Updates the password of the user with the specified ID.

#### Parameters

- **userId:** The ID of the user.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Request Body

A password object.

#### Status Code

- 204 No Content

#### Errors

If an error occurs, the response will include an error message. For example, if the userId is not found, a 404 status code will be returned with an error message. If the userId or password in the request body is missing, a 400 status code will be returned with an error message. If the data returned is not of the expected type, a 500 status code will be returned with an error message.

# Tags

### GET /users/:userId/files/:fileId/tags/

Fetches the tags associated with a specific file of a user.

#### Parameters

- **userId:** The ID of the user.
- **fileId:** The ID of the file.
- **search:** (Optional) A search term to filter tags.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Response

An array of tag objects.

- **Status Code:** 200 OK

#### Errors

If an error occurs, the response will include an error message. For example, if the userId or fileId is not found, a 404 status code will be returned with an error message. If the userId or fileId is missing, a 400 status code will be returned with an error message. If the data returned is not of the expected type, a 500 status code will be returned with an error message.

---

### GET /users/:userId/files/:fileId/tags/:tagId

Fetches a specific tag associated with a specific file of a user.

#### Parameters

- **userId:** The ID of the user.
- **fileId:** The ID of the file.
- **tagId:** The ID of the tag.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Response

A tag object.

- **Status Code:** 200 OK

#### Errors

If an error occurs, the response will include an error message. For example, if the userId, fileId, or tagId is not found, a 404 status code will be returned with an error message. If the userId, fileId, or tagId is missing, a 400 status code will be returned with an error message. If the data returned is not of the expected type, a 500 status code will be returned with an error message.

---

### POST /users/:userId/files/:fileId/tags

Creates a new tag associated with a specific file of a user.

#### Parameters

- **userId:** The ID of the user.
- **fileId:** The ID of the file.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Request Body

A tag object.

#### Response

The created tag object.

- **Status Code:** 201 Created

#### Errors

If an error occurs, the response will include an error message. For example, if the userId or fileId is not found, a 404 status code will be returned with an error message. If the userId or fileId is missing, a 400 status code will be returned with an error message. If the data returned is not of the expected type, a 500 status code will be returned with an error message.

---

### DELETE /users/:userId/files/:fileId/tags/:tagId

Deletes a specific tag associated with a specific file of a user.

#### Parameters

- **userId:** The ID of the user.
- **fileId:** The ID of the file.
- **tagId:** The ID of the tag.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Status Code

- 204 No Content

#### Errors

If an error occurs, the response will include an error message. For example, if the userId, fileId, or tagId is not found, a 404 status code will be returned with an error message. If the userId, fileId, or tagId is missing, a 400 status code will be returned with an error message. If the data returned is not of the expected type, a 500 status code will be returned with an error message.

# Settings

### GET /users/:userId/files/:fileId/tags/

Fetches the tags associated with a specific file of a user.

#### Parameters

- **userId:** The ID of the user.
- **fileId:** The ID of the file.
- **search:** (Optional) A search term to filter tags.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Response

An array of tag objects.

- **Status Code:** 200 OK

#### Errors

If an error occurs, the response will include an error message. For example, if the userId or fileId is not found, a 404 status code will be returned with an error message. If the userId or fileId is missing, a 400 status code will be returned with an error message. If the data returned is not of the expected type, a 500 status code will be returned with an error message.

---

### GET /users/:userId/files/:fileId/tags/:tagId

Fetches a specific tag associated with a specific file of a user.

#### Parameters

- **userId:** The ID of the user.
- **fileId:** The ID of the file.
- **tagId:** The ID of the tag.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Response

A tag object.

- **Status Code:** 200 OK

#### Errors

If an error occurs, the response will include an error message. For example, if the userId, fileId, or tagId is not found, a 404 status code will be returned with an error message. If the userId, fileId, or tagId is missing, a 400 status code will be returned with an error message. If the data returned is not of the expected type, a 500 status code will be returned with an error message.

---

### POST /users/:userId/files/:fileId/tags

Creates a new tag associated with a specific file of a user.

#### Parameters

- **userId:** The ID of the user.
- **fileId:** The ID of the file.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Request Body

A tag object.

#### Response

The created tag object.

- **Status Code:** 201 Created

#### Errors

If an error occurs, the response will include an error message. For example, if the userId or fileId is not found, a 404 status code will be returned with an error message. If the userId or fileId is missing, a 400 status code will be returned with an error message. If the data returned is not of the expected type, a 500 status code will be returned with an error message.

---

### DELETE /users/:userId/files/:fileId/tags/:tagId

Deletes a specific tag associated with a specific file of a user.

#### Parameters

- **userId:** The ID of the user.
- **fileId:** The ID of the file.
- **tagId:** The ID of the tag.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Status Code

- 204 No Content

#### Errors

If an error occurs, the response will include an error message. For example, if the userId, fileId, or tagId is not found, a 404 status code will be returned with an error message. If the userId, fileId, or tagId is missing, a 400 status code will be returned with an error message. If the data returned is not of the expected type, a 500 status code will be returned with an error message.

# Comments

### GET /users/:userId/files/:fileId/comments

Fetches the comments associated with a specific file of a user.

#### Parameters

- **userId:** The ID of the user.
- **fileId:** The ID of the file.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Response

An array of comment objects.

- **Status Code:** 200 OK

#### Errors

If an error occurs, the response will include an error message. For example, if the userId or fileId is not found, a 404 status code will be returned with an error message. If the userId or fileId is missing, a 400 status code will be returned with an error message. If the data returned is not of the expected type, a 500 status code will be returned with an error message.

---

### POST /users/:userId/files/:fileId/comments

Creates a new comment for a specific file of a user.

#### Parameters

- **userId:** The ID of the user.
- **fileId:** The ID of the file.
- **comment:** The content of the comment.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Response

The created comment object.

- **Status Code:** 201 Created

#### Errors

If an error occurs, the response will include an error message. For example, if the userId or fileId is not found, a 404 status code will be returned with an error message. If the userId, fileId, or comment is missing, a 400 status code will be returned with an error message. If the data returned is not of the expected type, a 500 status code will be returned with an error message.

---

### DELETE /users/:userId/files/:fileId/comments/:commentId

Deletes a specific comment of a specific file of a user.

#### Parameters

- **userId:** The ID of the user.
- **fileId:** The ID of the file.
- **commentId:** The ID of the comment.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Status Code

- 204 No Content

#### Errors

If an error occurs, the response will include an error message. For example, if the userId, fileId, or commentId is not found, a 404 status code will be returned with an error message. If the userId, fileId, or commentId is missing, a 400 status code will be returned with an error message.

# Activities

### GET /users/:userId/files/:fileId/activities

Fetches the activities associated with a specific file of a user.

#### Parameters

- **userId:** The ID of the user.
- **fileId:** The ID of the file.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Response

An array of activity objects.

- **Status Code:** 200 OK

#### Errors

If an error occurs, the response will include an error message. For example, if the userId or fileId is not found, a 404 status code will be returned with an error message. If the userId or fileId is missing, a 400 status code will be returned with an error message. If the data returned is not of the expected type, a 500 status code will be returned with an error message.

---

### POST /users/:userId/files/:fileId/activities

Creates a new activity for a specific file of a user.

#### Parameters

- **userId:** The ID of the user.
- **fileId:** The ID of the file.
- **activity:** The content of the activity.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Response

The created activity object.

- **Status Code:** 201 Created

#### Errors

If an error occurs, the response will include an error message. For example, if the userId or fileId is not found, a 404 status code will be returned with an error message. If the userId, fileId, or activity is missing, a 400 status code will be returned with an error message. If the data returned is not of the expected type, a 500 status code will be returned with an error message.

# Files

### GET /users/:userId/files/download

Downloads one or more files of a user.

#### Parameters

- **userId:** The ID of the user.
- **fileIds:** An array of file IDs.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Response

The downloaded file(s) as a zip file.

- **Status Code:** 200 OK

#### Errors

If an error occurs, the response will include an error message. For example, if the userId or any of the fileIds is not found, a 404 status code will be returned with an error message. If the userId or fileIds are missing, a 400 status code will be returned with an error message.

---

### GET /users/:userId/files/breadcrumbs

Fetches the breadcrumbs for a user's file directory.

#### Parameters

- **userId:** The ID of the user.
- **folderIds:** An array of folder IDs.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Response

An array of breadcrumb objects.

- **Status Code:** 200 OK

#### Errors

If an error occurs, the response will include an error message. For example, if the userId or any of the folderIds is not found, a 404 status code will be returned with an error message. If the userId or folderIds are missing, a 400 status code will be returned with an error message.

---

### GET /users/:userId/files

Fetches the files of a user.

#### Parameters

- **userId:** The ID of the user.
- **tags:** An array of tag names.
- **parent_id:** The ID of the parent folder.
- **is_favorite:** A flag indicating whether to fetch only favorite files.
- **is_deleted:** A flag indicating whether to fetch only deleted files.
- **all_files:** A flag indicating whether to fetch all files.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Response

An array of file objects.

- **Status Code:** 200 OK

#### Errors

If an error occurs, the response will include an error message. For example, if the userId is not found, a 404 status code will be returned with an error message. If the userId is missing, a 400 status code will be returned with an error message.

---

### GET /users/:userId/files/:fileId

Fetches a specific file of a user.

#### Parameters

- **userId:** The ID of the user.
- **fileId:** The ID of the file.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Response

The file object.

- **Status Code:** 200 OK

#### Errors

If an error occurs, the response will include an error message. For example, if the userId or fileId is not found, a 404 status code will be returned with an error message. If the userId or fileId is missing, a 400 status code will be returned with an error message.

---

### POST /users/:userId/files/upload

Uploads a file for a user.

#### Parameters

- **userId:** The ID of the user.
- **file:** The file to be uploaded.
- **parent_id:** The ID of the parent folder.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Response

The uploaded file object.

- **Status Code:** 201 Created

#### Errors

If an error occurs, the response will include an error message. For example, if the userId is not found, a 404 status code will be returned with an error message. If the userId or file is missing, a 400 status code will be returned with an error message.

---

### POST /users/:userId/files

Creates a new folder for a user.

#### Parameters

- **userId:** The ID of the user.
- **name:** The name of the folder.
- **is_folder:** A flag indicating that the new file is a folder.
- **parent_id:** The ID of the parent folder.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Response

The created folder object.

- **Status Code:** 201 Created

---

### PUT /users/:userId/files/:fileId

Updates a specific file of a user.

#### Parameters

- **userId:** The ID of the user.
- **fileId:** The ID of the file.
- **name:** The name of the file.
- **size:** The size of the file.
- **is_folder:** A flag indicating whether the file is a folder.
- **is_favorite:** A flag indicating whether the file is a favorite.
- **is_deleted:** A flag indicating whether the file is deleted.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Response

The updated file object.

- **Status Code:** 201 Created

---

### PATCH /users/:userId/files/:fileId

Partially updates a specific file of a user.

#### Parameters

- **userId:** The ID of the user.
- **fileId:** The ID of the file.
- **name:** The name of the file.
- **size:** The size of the file.
- **is_folder:** A flag indicating whether the file is a folder.
- **is_favorite:** A flag indicating whether the file is a favorite.
- **is_deleted:** A flag indicating whether the file is deleted.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Response

The patched file object.

- **Status Code:** 201 Created

---

### PATCH /users/:userId/files

Partially updates multiple files of a user.

#### Parameters

- **userId:** The ID of the user.
- **ids:** An array of file IDs.
- **updates:** An object containing the fields to be updated.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Response

No content.

- **Status Code:** 204 No Content

---

### DELETE /users/:userId/files/:fileId

Deletes a specific file of a user.

#### Parameters

- **userId:** The ID of the user.
- **fileId:** The ID of the file.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Response

No content.

- **Status Code:** 204 No Content

---

### DELETE /users/:userId/files

Deletes multiple files of a user.

#### Parameters

- **userId:** The ID of the user.
- **ids:** An array of file IDs.

#### Headers

- **Authorization:** Bearer token for authentication.

#### Response

No content.

- **Status Code:** 204 No Content
