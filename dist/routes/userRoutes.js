"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersService_1 = require("../services/usersService");
const utils_1 = require("../utils");
const router = (0, express_1.Router)();
router.get("/users/:userId", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const user = await (0, usersService_1.getUserById)(userId);
        res.status(200).send(user);
    }
    catch (err) {
        (0, utils_1.handleError)(err, res);
    }
});
router.put("/users/:userId", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const { full_name, email, avatar_url } = req.body;
        await (0, usersService_1.updateUser)(userId, full_name, email, avatar_url);
        res.status(204).end();
    }
    catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});
router.patch("/users/:userId/password", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const { password } = req.body;
        await (0, usersService_1.updatePassword)(userId, password);
        res.status(204).end();
    }
    catch (err) {
        (0, utils_1.handleError)(err, res);
    }
});
exports.default = router;
