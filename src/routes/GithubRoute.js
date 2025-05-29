import express from "express";

import { validateSchema } from "../middlewares/validateSchema.js";
import {
  searchGithubUsersSchema,
  findGitHubUserProfileSchema,
} from "../validators/githubSchema.js";
import {
  findGitHubUserProfileController,
  searchGithubUserController,
} from "../controllers/GithubController.js";

const router = express.Router();

router.get(
  `/search-github-users`,
  validateSchema(searchGithubUsersSchema, "query"),
  searchGithubUserController
);

router.get(
  `/find-github-user-profile`,
  validateSchema(findGitHubUserProfileSchema, "query"),
  findGitHubUserProfileController
);
export default router;
