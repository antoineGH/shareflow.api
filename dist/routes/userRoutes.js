"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersService_1 = require("src/services/usersService");
const router = (0, express_1.Router)();
router.get("/users", async (req, res) => {
    const users = await (0, usersService_1.getUsers)();
    res.status(200).send(users);
});
router.get("/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await (0, usersService_1.getUserById)(id);
    res.status(200).send(user);
});
router.post("/users", async (req, res) => {
    try {
        const { full_name, email, avatar_url } = req.body;
        const user = await (0, usersService_1.createUser)(full_name, email, avatar_url);
        res.status(201).send(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while creating the user.");
    }
});
exports.default = router;
