import { Router, Request, Response } from "express";
import { getSettings } from "../services/settingsService";
import { handleError } from "../utils";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();

router.get(
  "/users/:userId/settings",
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const settings = await getSettings(userId);

      res.status(200).send(settings);
    } catch (err) {
      handleError(err, res);
    }
  }
);

export default router;
