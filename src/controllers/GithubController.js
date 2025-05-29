import {
  successResponse,
  errorResponse,
} from "../helpers/responses/response.js";
import axios from "axios";

/**
 * Search GitHub users by keyword with pagination.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.q - Search keyword
 * @param {number} req.query.page - Page number
 * @param {number} req.query.per_page - Number of results per page
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON with array of GitHub users
 */
export const searchGithubUserController = async (req, res) => {
  const { q, page, per_page } = req.query;

  try {
    const { data } = await axios.get(
      process.env.NEXT_PUBLIC_GITHUB_SEARCH_USER,
      {
        params: { q, page, per_page },
      }
    );

    return successResponse({
      res,
      status: 200,
      data: data,
      message: ``,
    });
  } catch (error) {
    console.error("❌ GitHub search error:", error.message);
    return errorResponse({
      res,
      status: 500,
      message: "GitHub search failed",
      error: error.message,
    });
  }
};

/**
 * Find a GitHub user by ID.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} req.query.github_user_id - GitHub user ID
 * @param {Object} res - Express response object
 * 
 * @returns {Object} JSON with user profile data
 */
export const findGitHubUserProfileController = async (req, res) => {
  const { github_user_id } = req.query;

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_GITHUB_USER}/${github_user_id}`
    );
    return successResponse({
      res,
      status: 200,
      data: data,
      message: ``,
    });
  } catch (error) {
    console.error("❌ GitHub user fetch error:", err.message);
    return errorResponse({
      res,
      status: 500,
      message: "GitHub user fetch failed",
      error: error.message,
    });
  }
};
