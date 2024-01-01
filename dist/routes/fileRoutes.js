"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const filesService_1 = require("../services/filesService");
const utils_1 = require("../utils");
const router = (0, express_1.Router)();
router.get("/users/:userId/files", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const tagNames = req.query.tags
            ? req.query.tags.split(",")
            : [];
        const filters = {
            is_favorite: req.query.is_favorite
                ? parseInt(req.query.is_favorite)
                : undefined,
            is_deleted: req.query.is_deleted
                ? parseInt(req.query.is_deleted)
                : undefined,
            all_files: req.query.all_files
                ? parseInt(req.query.all_files)
                : undefined,
        };
        const files = await (0, filesService_1.getFiles)(userId, filters, tagNames);
        res.status(200).send(files);
    }
    catch (err) {
        (0, utils_1.handleError)(err, res);
    }
});
router.get("/users/:userId/files/:fileId", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const fileId = parseInt(req.params.fileId);
        const file = await (0, filesService_1.getFileById)(userId, fileId);
        res.status(200).send(file);
    }
    catch (err) {
        (0, utils_1.handleError)(err, res);
    }
});
router.post("/users/:userId/files", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const file = req.body;
        const { name, size, path, is_folder, is_favorite, is_deleted } = file;
        const newFile = await (0, filesService_1.createFile)({
            userId,
            name,
            size,
            path,
            is_folder,
            is_favorite,
            is_deleted,
        });
        res.status(201).send(newFile);
    }
    catch (err) {
        (0, utils_1.handleError)(err, res);
    }
});
router.put("/users/:userId/files/:fileId", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const fileId = parseInt(req.params.fileId);
        const file = req.body;
        const { name, size, path, is_folder, is_favorite, is_deleted } = file;
        const newFile = await (0, filesService_1.updateFile)(userId, fileId, {
            name,
            size,
            path,
            is_folder,
            is_favorite,
            is_deleted,
        });
        res.status(200).send(newFile);
    }
    catch (err) {
        (0, utils_1.handleError)(err, res);
    }
});
router.patch("/users/:userId/files/:fileId", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const fileId = parseInt(req.params.fileId);
        const file = req.body;
        const { name, size, path, is_folder, is_favorite, is_deleted } = file;
        const newFile = await (0, filesService_1.patchFile)(userId, fileId, {
            name,
            size,
            path,
            is_folder,
            is_favorite,
            is_deleted,
        });
        res.status(200).send(newFile);
    }
    catch (err) {
        (0, utils_1.handleError)(err, res);
    }
});
router.delete("/users/:userId/files/:fileId", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const fileId = parseInt(req.params.fileId);
        await (0, filesService_1.deleteFile)(userId, fileId);
        res.sendStatus(204);
    }
    catch (err) {
        (0, utils_1.handleError)(err, res);
    }
});
exports.default = router;
