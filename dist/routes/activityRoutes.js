"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activitiesService_1 = require("../services/activitiesService");
const utils_1 = require("../utils");
const router = (0, express_1.Router)();
router.get("/users/:userId/files/:fileId/activities", async (req, res) => {
    try {
        const fileId = parseInt(req.params.fileId);
        const activities = await (0, activitiesService_1.getActivities)(fileId);
        res.status(200).send(activities);
    }
    catch (err) {
        (0, utils_1.handleError)(err, res);
    }
});
router.post("/users/:userId/files/:fileId/activities", async (req, res) => {
    try {
        const fileId = parseInt(req.params.fileId);
        const userId = parseInt(req.params.userId);
        const activity = req.body.activity;
        const newActivity = await (0, activitiesService_1.createActivity)(userId, fileId, activity);
        res.status(201).send(newActivity);
    }
    catch (err) {
        (0, utils_1.handleError)(err, res);
    }
});
exports.default = router;
