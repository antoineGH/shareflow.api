import { Router, Request, Response } from "express";
import { handleError } from "../utils";
import { authenticateUser } from "../services/authService";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const token = await authenticateUser(email, password);

    res.status(200).json(token);
  } catch (err) {
    handleError(err, res);
  }
});

export default router;
