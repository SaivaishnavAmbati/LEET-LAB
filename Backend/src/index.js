import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problemRoutes.js";
import executionRoute from "./routes/execute-code.route.js";
import submissionRoutes from "./routes/submission.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin:"http://localhost:5173",
    credentials:true
  })
)
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello this is cohort ⏳⏳");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code",executionRoute);
app.use("/api/v1/submission" , submissionRoutes)

app.use("/api/v1/playlist" , playlistRoutes)

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 8080");
});
