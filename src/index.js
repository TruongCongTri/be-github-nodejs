import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();

import authRouter from "./routes/AuthRoute.js";
import githubRouter from "./routes/GithubRoute.js";
import userRouter from "./routes/UserRoute.js";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello from ESModule Express!");
});
app.use("/api/auth", authRouter);
app.use("/api/github", githubRouter);
app.use("/api/user", userRouter);

const PORT = process.env.HTTP_PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
