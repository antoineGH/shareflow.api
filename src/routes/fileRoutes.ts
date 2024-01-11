import { Router, Request, Response } from "express";
import {
  createFile,
  createFolder,
  deleteFile,
  deleteFiles,
  downloadFile,
  downloadFiles,
  getBreadcrumbs,
  getFileById,
  getFiles,
  patchFile,
  patchFiles,
  updateFile,
} from "../services/filesService";
import fs from "fs";
import { handleError } from "../utils";
import type { Filters } from "../types/files";
import { checkAuth } from "../middleware/checkAuth";
import upload from "../multerConfig";

const router = Router();

router.get(
  "/users/:userId/files/download",
  checkAuth,
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const fileIds: number[] = req.query.fileIds
      ? (req.query.fileIds as string).split(",").map(Number)
      : [];

    if (fileIds.length === 1) {
      const { file, fileName } = await downloadFile(userId, fileIds[0]);
      res.setHeader("Content-Disposition", 'filename="files.zip"');
      return res.download(file, fileName);
    }

    const files = await downloadFiles(userId, fileIds);
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="files.zip"');
    fs.createReadStream(files).pipe(res);
  }
);

router.get(
  "/users/:userId/files/breadcrumbs",
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const folderIds: string[] = req.query.folderIds
        ? (req.query.folderIds as string).split(",")
        : [];

      const breadcrumbs = await getBreadcrumbs(userId, folderIds);

      res.status(200).send(breadcrumbs);
    } catch (err) {
      handleError(err, res);
    }
  }
);

router.get(
  "/users/:userId/files",
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);

      const tagNames: string[] = req.query.tags
        ? (req.query.tags as string).split(",")
        : [];

      const parentId = req.query.parent_id
        ? parseInt(req.query.parent_id as string)
        : undefined;

      const filters: Filters = {
        is_favorite: req.query.is_favorite
          ? parseInt(req.query.is_favorite as string)
          : undefined,
        is_deleted: req.query.is_deleted
          ? parseInt(req.query.is_deleted as string)
          : undefined,
        all_files: req.query.all_files
          ? parseInt(req.query.all_files as string)
          : undefined,
      };

      const files = await getFiles(userId, filters, tagNames, parentId);

      res.status(200).send(files);
    } catch (err) {
      handleError(err, res);
    }
  }
);

router.get(
  "/users/:userId/files/:fileId",
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const fileId = parseInt(req.params.fileId);

      const file = await getFileById(userId, fileId);

      res.status(200).send(file);
    } catch (err) {
      handleError(err, res);
    }
  }
);

router.post(
  "/users/:userId/files/upload",
  checkAuth,
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const file = req.file;

      const parentIds: string[] = req.query.parent_id
        ? (req.query.parent_id as string).split(",")
        : [];

      let parentId: number | undefined = undefined;
      if (parentIds.length > 0) {
        parentId = parseInt(parentIds[0]);
      }

      const newFile = await createFile({
        userId,
        file,
        parentId,
      });

      res.status(201).send(newFile);
    } catch (err) {
      handleError(err, res);
    }
  }
);

router.post(
  "/users/:userId/files",
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const fileMetadata = req.body;
      const { name, is_folder, parent_id } = fileMetadata;

      const newFolder = await createFolder({
        userId,
        name,
        is_folder,
        parent_id,
      });
      res.status(201).send(newFolder);
    } catch (err) {
      handleError(err, res);
    }
  }
);

router.put(
  "/users/:userId/files/:fileId",
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const fileId = parseInt(req.params.fileId);
      const file = req.body;
      const { name, size, is_folder, is_favorite, is_deleted } = file;

      const updatedFile = await updateFile(userId, fileId, {
        name,
        size,
        is_folder,
        is_favorite,
        is_deleted,
      });

      res.status(201).send(updatedFile);
    } catch (err) {
      handleError(err, res);
    }
  }
);

router.patch(
  "/users/:userId/files/:fileId",
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const fileId = parseInt(req.params.fileId);
      const file = req.body;
      const { name, size, is_folder, is_favorite, is_deleted } = file;

      const patchedFile = await patchFile(userId, fileId, {
        name,
        size,
        is_folder,
        is_favorite,
        is_deleted,
      });
      res.status(201).send(patchedFile);
    } catch (err) {
      handleError(err, res);
    }
  }
);

router.patch("/users/:userId/files", checkAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const ids: number[] = req.body.ids;
    const updates = req.body.updates;

    const is_favorite = updates?.is_favorite ?? undefined;
    const is_deleted = updates?.is_deleted ?? undefined;

    await patchFiles(userId, ids, {
      is_favorite,
      is_deleted,
    });

    res.sendStatus(204);
  } catch (err) {
    handleError(err, res);
  }
});

router.delete("/users/:userId/files/:fileId", checkAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const fileId = parseInt(req.params.fileId);

    await deleteFile(userId, fileId);

    res.sendStatus(204);
  } catch (err) {
    handleError(err, res);
  }
});

router.delete("/users/:userId/files", checkAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const ids: number[] = req.body.ids;

    await deleteFiles(userId, ids);

    res.sendStatus(204);
  } catch (err) {
    handleError(err, res);
  }
});

export default router;
