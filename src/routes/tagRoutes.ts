import { Router, Request, Response } from "express";
import {
  getTags,
  getTagById,
  deleteTag,
  createTag,
} from "../services/tagsService";
import { RessourceNotFoundError, handleError } from "../utils";

const router = Router();

router.get(
  "/users/:userId/files/:fileId/tags/",
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const fileId = parseInt(req.params.fileId);
      const tags = await getTags(userId, fileId);

      res.status(200).send(tags);
    } catch (err) {
      handleError(err, res);
    }
  }
);

router.get(
  "/users/:userId/files/:fileId/tags/:tagId",
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const fileId = parseInt(req.params.fileId);
      const tagId = parseInt(req.params.tagId);

      const tag = await getTagById(userId, fileId, tagId);

      res.status(200).send(tag);
    } catch (err) {
      handleError(err, res);
    }
  }
);

router.post(
  "/users/:userId/files/:fileId/tags",
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const fileId = parseInt(req.params.fileId);
      const tag = req.body.tag;

      const newTag = await createTag(userId, fileId, tag);

      res.status(201).send(newTag);
    } catch (err) {
      handleError(err, res);
    }
  }
);

router.delete(
  "/users/:userId/files/:fileId/tags/:tagId",
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const fileId = parseInt(req.params.fileId);
      const tagId = parseInt(req.params.tagId);

      await deleteTag(userId, fileId, tagId);

      res.status(204).end();
    } catch (err) {
      handleError(err, res);
    }
  }
);

export default router;
