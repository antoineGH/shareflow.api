import app from "./index";
import userRoutes from "./routes/userRoutes";
import tagRoutes from "./routes/tagRoutes";
import commentRoutes from "./routes/commentRoutes";
import activityRoutes from "./routes/activityRoutes";
import { errorHandler } from "./utils";

app.use(userRoutes);
app.use(tagRoutes);
app.use(commentRoutes);
app.use(activityRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
