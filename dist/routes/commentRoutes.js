"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentsService_1 = require("../services/commentsService");
const utils_1 = require("../utils");
const router = (0, express_1.Router)();
router.get("/users/:userId/files/:fileId/comments", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const fileId = parseInt(req.params.fileId);
        const comments = await (0, commentsService_1.getComments)(userId, fileId);
        res.status(200).send(comments);
    }
    catch (err) {
        (0, utils_1.handleError)(err, res);
    }
});
router.get("/users/:userId/files/:fileId/comments/:commentId", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const fileId = parseInt(req.params.fileId);
        const commentId = parseInt(req.params.commentId);
        const comment = await (0, commentsService_1.getCommentById)(userId, fileId, commentId);
        res.status(200).send(comment);
    }
    catch (err) {
        (0, utils_1.handleError)(err, res);
    }
});
router.post("/users/:userId/files/:fileId/comments/", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const fileId = parseInt(req.params.fileId);
        const comment = req.body.comment;
        const newComment = await (0, commentsService_1.createComment)(userId, fileId, comment);
        res.status(201).send(newComment);
    }
    catch (err) {
        (0, utils_1.handleError)(err, res);
    }
});
router.delete("/users/:userId/files/:fileId/comments/:commentId", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const fileId = parseInt(req.params.fileId);
        const commentId = parseInt(req.params.commentId);
        await (0, commentsService_1.deleteComment)(userId, fileId, commentId);
        res.status(204).end();
    }
    catch (err) {
        (0, utils_1.handleError)(err, res);
    }
});
exports.default = router;
