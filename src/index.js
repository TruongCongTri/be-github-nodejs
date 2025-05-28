import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();

import authRoutes from "./routes/auth.js";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello from ESModule Express!");
});
app.use("/api/auth", authRoutes);

const PORT = process.env.HTTP_PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
