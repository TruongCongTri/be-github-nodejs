/**
 * @file Defines user-related routes for liking GitHub profiles and retrieving user profiles.
 * Prefix: /api/user
 */

import express from "express";

import { validateSchema } from "../middlewares/validateSchema.js";
import {
  getUserProfileSchema,
  likeGitHubUserSchema,
} from "../validators/userSchema.js";
import {
  getUserProfileController,
  likeGitHubUserController,
  // getLikedGithubController
} from "../controllers/UserController.js";

const router = express.Router();

/**
 * @route GET /api/user/profile?phone_number
 * @desc Retrieve user profile and liked GitHub profiles
 * @access Public
 */
router.get(
  "/profile",
  validateSchema(getUserProfileSchema, "query"),
  getUserProfileController
);

/**
 * @route POST /api/user/like-github-user
 * @desc Save a liked GitHub profile for the user
 * @access Public
 */
router.post(
  "/like-github-user",
  validateSchema(likeGitHubUserSchema),
  likeGitHubUserController
);

/**
 * @route GET /api/user/profile?phone_number
 * @desc Retrieve user profile and liked GitHub profiles
 * @access Public
 */
// router.get(
//   "/profile/liked-github",
//   validateSchema(getUserProfileSchema, "query"),
//   getLikedGithubController
// );
export default router;
