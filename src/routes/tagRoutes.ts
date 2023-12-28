import { Router, Request, Response } from "express";
import { getTags, getTagById, deleteTag } from "../services/tagsService";
import { RessourceNotFoundError, handleError } from "../utils";

const router = Router();

router.get("/user/:userId/tags/", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const tags = await getTags(userId);
    res.status(200).send(tags);
  } catch (err) {
    handleError(err, res);
  }
});

router.get("/user/:userId/tags/:tagId", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const tagId = parseInt(req.params.tagId);
    const tag = await getTagById(userId, tagId);
    res.status(200).send(tag);
  } catch (err) {
    handleError(err, res);
  }
});

router.delete(
  "/user/:userId/tags/:tagId",
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const tagId = parseInt(req.params.tagId);
      const affectedRows = await deleteTag(userId, tagId);
      if (affectedRows > 0) {
        res.status(204).end();
      } else {
        throw new RessourceNotFoundError("Tag not found.");
      }
    } catch (err) {
      handleError(err, res);
    }
  }
);

export default router;
