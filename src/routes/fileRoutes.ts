import { Router, Request, Response } from "express";
import { getFileById, getFiles } from "../services/filesService";
import { handleError } from "../utils";

const router = Router();

router.get("/users/:userId/files", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);

    const files = await getFiles(userId);

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

export default router;
