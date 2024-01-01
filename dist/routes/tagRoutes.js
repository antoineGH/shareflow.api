"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tagsService_1 = require("../services/tagsService");
const utils_1 = require("../utils");
const router = (0, express_1.Router)();
router.get("/users/:userId/files/:fileId/tags/", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const fileId = parseInt(req.params.fileId);
        const tags = await (0, tagsService_1.getTags)(userId, fileId);
        res.status(200).send(tags);
    }
    catch (err) {
        (0, utils_1.handleError)(err, res);
    }
});
router.get("/users/:userId/files/:fileId/tags/:tagId", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const fileId = parseInt(req.params.fileId);
        const tagId = parseInt(req.params.tagId);
        const tag = await (0, tagsService_1.getTagById)(userId, fileId, tagId);
        res.status(200).send(tag);
    }
    catch (err) {
        (0, utils_1.handleError)(err, res);
    }
});
router.post("/users/:userId/files/:fileId/tags", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const fileId = parseInt(req.params.fileId);
        const tag = req.body.tag;
        const newTag = await (0, tagsService_1.createTag)(userId, fileId, tag);
        res.status(201).send(newTag);
    }
    catch (err) {
        (0, utils_1.handleError)(err, res);
    }
});
router.delete("/users/:userId/files/:fileId/tags/:tagId", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const fileId = parseInt(req.params.fileId);
        const tagId = parseInt(req.params.tagId);
        await (0, tagsService_1.deleteTag)(userId, fileId, tagId);
        res.status(204).end();
    }
    catch (err) {
        (0, utils_1.handleError)(err, res);
    }
});
exports.default = router;
