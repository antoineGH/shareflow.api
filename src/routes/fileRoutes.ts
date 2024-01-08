import { Router, Request, Response } from "express";
import {
  createFile,
  deleteFile,
  deleteFiles,
  getFileById,
  getFiles,
  patchFile,
  patchFiles,
  updateFile,
} from "../services/filesService";
import { handleError } from "../utils";
import type { Filters } from "../types/files";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();

router.get(
  "/users/:userId/files",
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const tagNames: string[] = req.query.tags
        ? (req.query.tags as string).split(",")
        : [];
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

      const files = await getFiles(userId, filters, tagNames);

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
  "/users/:userId/files",
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const file = req.body;
      const { name, size, path, is_folder, is_favorite, is_deleted } = file;

      const newFile = await createFile({
        userId,
        name,
        size,
        path,
        is_folder,
        is_favorite,
        is_deleted,
      });
      res.status(201).send(newFile);
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
      const { name, size, path, is_folder, is_favorite, is_deleted } = file;

      const updatedFile = await updateFile(userId, fileId, {
        name,
        size,
        path,
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
      const { name, size, path, is_folder, is_favorite, is_deleted } = file;

      const patchedFile = await patchFile(userId, fileId, {
        name,
        size,
        path,
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
