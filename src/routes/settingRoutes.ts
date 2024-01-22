import { Router, Request, Response } from "express";
import { getSettings } from "../services/settingsService";
import { handleError } from "../utils";
import { checkAuth } from "../middleware/checkAuth";
import app from "../index";

const router = Router();
const vhostUrl = process.env.VHOST_URL || "";
app.use(vhostUrl, router);

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
