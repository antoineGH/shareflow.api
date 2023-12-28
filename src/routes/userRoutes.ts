import { Router, Request, Response } from "express";
import {
  createUser,
  getUserById,
  getUsers,
  updatePassword,
  updateUser,
} from "../services/usersService";
import { handleError } from "../utils";

const router = Router();

router.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.status(200).send(users);
  } catch (err) {
    handleError(err, res);
  }
});

router.get("/users/:userId", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await getUserById(userId);
    res.status(200).send(user);
  } catch (err) {
    handleError(err, res);
  }
});

router.put("/users/:userId", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const { full_name, email, avatar_url } = req.body;
    const user = await updateUser(userId, full_name, email, avatar_url);
    if (user) {
      await createUser(full_name, email, avatar_url);
      res.status(200).send("User updated successfully.");
    } else {
      res.status(404).send("User not found.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.patch("/users/:userId/password", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const { password } = req.body;
    const user = await updatePassword(userId, password);
    if (user) {
      res.status(204).end();
    }
  } catch (err) {
    handleError(err, res);
  }
});

router.post("/users", async (req: Request, res: Response) => {
  try {
    const { full_name, email, password, avatar_url } = req.body;
    const user = await createUser(full_name, email, password, avatar_url);
    res.status(201).send(user);
  } catch (err) {
    handleError(err, res);
  }
});

export default router;
