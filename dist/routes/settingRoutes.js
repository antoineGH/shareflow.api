"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settingsService_1 = require("../services/settingsService");
const utils_1 = require("../utils");
const router = (0, express_1.Router)();
router.get("/users/:userId/settings", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const settings = await (0, settingsService_1.getSettings)(userId);
        res.status(200).send(settings);
    }
    catch (err) {
        (0, utils_1.handleError)(err, res);
    }
});
exports.default = router;
