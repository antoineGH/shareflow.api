import { Router, Request, Response } from "express";
import {
  getUserById,
  updateUser,
  updatePassword,
} from "../services/usersService";
import { handleError } from "../utils";
import { checkAuth } from "../middleware/checkAuth";
import app from "../index";

const router = Router();
const vhostUrl = process.env.VHOST_URL || "";
app.use(vhostUrl, router);

router.get("/users/:userId", checkAuth, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);

    const user = await getUserById(userId);

    res.status(200).send(user);
  } catch (err) {
    handleError(err, res);
  }
});

router.put("/users/:userId", checkAuth, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);

    const { full_name, email, avatar_url } = req.body;

    await updateUser(userId, full_name, email);

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.patch(
  "/users/:userId/password",
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const { password } = req.body;

      await updatePassword(userId, password);

      res.status(204).end();
    } catch (err) {
      handleError(err, res);
    }
  }
);

export default router;
