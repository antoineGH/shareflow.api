import { Router, Request, Response } from "express";
import { createFile, getFileById, getFiles } from "../services/filesService";
import { handleError } from "../utils";
import type { Filters } from "../types/files";

const router = Router();

router.get("/users/:userId/files", async (req: Request, res: Response) => {
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

    console.log("tagNames", tagNames);
    const files = await getFiles(userId, filters, tagNames);

    res.status(200).send(files);
  } catch (err) {
    handleError(err, res);
  }
});

router.get(
  "/users/:userId/files/:fileId",
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

router.post("/users/:userId/files", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const file = req.body;
    const { name, size, path, isFolder, isFavorite, isDeleted } = file;

    const newFile = await createFile({
      userId,
      name,
      size,
      path,
      isFolder,
      isFavorite,
      isDeleted,
    });
    res.status(201).send(newFile);
  } catch (err) {
    handleError(err, res);
  }
});

export default router;
