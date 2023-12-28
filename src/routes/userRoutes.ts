import { Router, Request, Response } from "express";
import { createUser, getUserById, getUsers } from "../services/usersService";

const router = Router();

router.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.status(200).send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching the users.");
  }
});

router.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await getUserById(id);
    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching the user.");
  }
});

router.post("/users", async (req: Request, res: Response) => {
  try {
    const { full_name, email, avatar_url } = req.body;
    const user = await createUser(full_name, email, avatar_url);
    res.status(201).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while creating the user.");
  }
});

export default router;
