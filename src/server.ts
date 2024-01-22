import app from "./index";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import tagRoutes from "./routes/tagRoutes";
import commentRoutes from "./routes/commentRoutes";
import activityRoutes from "./routes/activityRoutes";
import settingRoutes from "./routes/settingRoutes";
import fileRoutes from "./routes/fileRoutes";
import { errorHandler } from "./utils";

app.use(authRoutes);
app.use(userRoutes);
app.use(tagRoutes);
app.use(commentRoutes);
app.use(activityRoutes);
app.use(settingRoutes);
app.use(fileRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
