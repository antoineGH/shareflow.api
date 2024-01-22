import { Router, Request, Response } from "express";
import { getActivities, createActivity } from "../services/activitiesService";
import { handleError } from "../utils";
import { checkAuth } from "../middleware/checkAuth";
import app from "../index";

const router = Router();
const vhostUrl = process.env.VHOST_URL || "";
app.use(vhostUrl, router);

router.get(
  "/users/:userId/files/:fileId/activities",
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      const fileId = parseInt(req.params.fileId);

      const activities = await getActivities(fileId);

      res.status(200).send(activities);
    } catch (err) {
      handleError(err, res);
    }
  }
);

router.post(
  "/users/:userId/files/:fileId/activities",
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      const fileId = parseInt(req.params.fileId);
      const userId = parseInt(req.params.userId);
      const activity = req.body.activity;

      const newActivity = await createActivity(userId, fileId, activity);

      res.status(201).send(newActivity);
    } catch (err) {
      handleError(err, res);
    }
  }
);

export default router;
