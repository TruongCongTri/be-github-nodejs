/**
 * @file Defines GitHub-related routes for user search and profile lookup.
 * Prefix: /api/github
 */
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

/**
 * @route GET /api/github/search
 * @desc Search GitHub users by username with pagination
 * @access Public
 */
router.get(
  `/search`,
  validateSchema(searchGithubUsersSchema, "query"),
  searchGithubUserController
);

/**
 * @route GET /api/github?github_user_id
 * @desc Get details for a GitHub user by ID
 * @access Public
 */
router.get(
  `/`,
  validateSchema(findGitHubUserProfileSchema, "query"),
  findGitHubUserProfileController
);
export default router;
