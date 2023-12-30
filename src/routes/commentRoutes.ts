import { Router, Request, Response } from "express";
import {
  createComment,
  deleteComment,
  getCommentById,
  getComments,
} from "../services/commentsService";
import { handleError } from "../utils";

const router = Router();

router.get(
  "/users/:userId/files/:fileId/comments",
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const fileId = parseInt(req.params.fileId);

      const comments = await getComments(userId, fileId);

      res.status(200).send(comments);
    } catch (err) {
      handleError(err, res);
    }
  }
);

router.get(
  "/users/:userId/files/:fileId/comments/:commentId",
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const fileId = parseInt(req.params.fileId);
      const commentId = parseInt(req.params.commentId);

      const comment = await getCommentById(userId, fileId, commentId);

      res.status(200).send(comment);
    } catch (err) {
      handleError(err, res);
    }
  }
);

router.post(
  "/users/:userId/files/:fileId/comments/",
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const fileId = parseInt(req.params.fileId);
      const comment = req.body.comment;

      const newComment = await createComment(userId, fileId, comment);

      res.status(201).send(newComment);
    } catch (err) {
      handleError(err, res);
    }
  }
);

router.delete(
  "/users/:userId/files/:fileId/comments/:commentId",
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const fileId = parseInt(req.params.fileId);
      const commentId = parseInt(req.params.commentId);

      await deleteComment(userId, fileId, commentId);

      res.status(204).end();
    } catch (err) {
      handleError(err, res);
    }
  }
);

export default router;
