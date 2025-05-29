import express from "express";
import {
  successResponse,
  errorResponse,
} from "../helpers/responses/response.js";
import axios from "axios";

import { validateSchema } from "../middlewares/validateSchema.js";
import {
  searchGithubUsersSchema,
  findGitHubUserProfileSchema,
} from "../validators/githubSchema.js";

const router = express.Router();

router.get(
  `/search-github-users`,
  validateSchema(searchGithubUsersSchema, "query"),
  async (req, res) => {
    const { q, page = 1, per_page = 10 } = req.query;

    if (!q)
      return errorResponse({
        res,
        status: 400,
        message: "Missing search term (q)",
      });

    try {
      const githubRes = await axios.get(
        process.env.NEXT_PUBLIC_GITHUB_SEARCH_USER,
        {
          params: { q, page, per_page },
        }
      );

      res.json(githubRes.data);
    } catch (error) {
      console.error("❌ GitHub search error:", err.message);
      return errorResponse({
        res,
        status: 500,
        message: "GitHub search failed",
      });
    }
  }
);

router.get(
  `/find-github-user-profile`,
  validateSchema(findGitHubUserProfileSchema, "query"),
  async (req, res) => {
    const { github_user_id } = req.query;

    if (!github_user_id)
      return errorResponse({
        res,
        status: 400,
        message: "Missing github_user_id",
      });

    try {
      const githubRes = await axios.get(
        `${process.env.NEXT_PUBLIC_GITHUB_USER}${github_user_id}`
      );
      res.json(githubRes.data);
    } catch (error) {
      console.error("❌ GitHub user fetch error:", err.message);
      return errorResponse({
        res,
        status: 500,
        message: "GitHub user fetch failed",
      });
    }
  }
);
export default router;
