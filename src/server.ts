import app from "./index";
import userRoutes from "./routes/userRoutes";
import tagRoutes from "./routes/tagRoutes";
import { errorHandler } from "./utils";

app.use(userRoutes);
app.use(tagRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
