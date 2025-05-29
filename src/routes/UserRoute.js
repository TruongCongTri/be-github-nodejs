import express from "express";

import { validateSchema } from "../middlewares/validateSchema.js";
import {
  getUserProfileSchema,
  likeGitHubUserSchema,
} from "../validators/userSchema.js";
import {
  getUserProfileController,
  likeGitHubUserController,
} from "../controllers/UserController.js";

const router = express.Router();

router.get(
  "/get-user-profile",
  validateSchema(getUserProfileSchema, "query"),
  getUserProfileController
);

router.post(
  "/like-github-user",
  validateSchema(likeGitHubUserSchema),
  likeGitHubUserController
);

export default router;
