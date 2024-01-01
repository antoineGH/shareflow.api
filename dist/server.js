"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const tagRoutes_1 = __importDefault(require("./routes/tagRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const activityRoutes_1 = __importDefault(require("./routes/activityRoutes"));
const settingRoutes_1 = __importDefault(require("./routes/settingRoutes"));
const fileRoutes_1 = __importDefault(require("./routes/fileRoutes"));
const utils_1 = require("./utils");
index_1.default.use(userRoutes_1.default);
index_1.default.use(tagRoutes_1.default);
index_1.default.use(commentRoutes_1.default);
index_1.default.use(activityRoutes_1.default);
index_1.default.use(settingRoutes_1.default);
index_1.default.use(fileRoutes_1.default);
index_1.default.use(utils_1.errorHandler);
const PORT = process.env.PORT || 3000;
index_1.default.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
