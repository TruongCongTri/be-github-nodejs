import {
  successResponse,
  errorResponse,
} from "../helpers/responses/response.js";
import { extractGithubData } from "../utils/extractGithubData.js";

import { fetchGithubUserByLogin } from "../helpers/github/fetchGithubUserByLogin.js";
import { searchGithubUsers } from "../helpers/github/searchGithubUsers.js";

//
import pLimit from "p-limit";
const limit = pLimit(5); // limit 5 concurrent GitHub requests

/**
 * Search GitHub users by keyword with pagination.
 *
 * @async
 * @function searchGithubUserController
 *
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.q - Search keyword
 * @param {number} req.query.page - Page number
 * @param {number} req.query.per_page - Number of results per page
 * @param {Object} res - Express response object
 *
 * @returns {Promise<Object>} JSON with array of GitHub users
 */
export const searchGithubUserController = async (req, res) => {
  const { q, page, per_page } = req.query;

  // if (!q || typeof q !== "string") {
  //   return errorResponse({
  //     res,
  //     statusCode: 422,
  //     message: "Invalid query parameter: 'q' is required",
  //     error: "Missing or invalid search term",
  //   });
  // }

  try {
    const searchRes = await searchGithubUsers(q, page, per_page);

    const rawUsers = searchRes.data.items;

    const enrichedUsers = await Promise.all(
      rawUsers.map((user) =>
        limit(async () => {
          const fullData = await fetchGithubUserByLogin(user.login);
          return fullData;
        })
      )
    );

    const { pagination } = extractGithubData(
      searchRes.data,
      Number(page),
      Number(per_page)
    );

    return successResponse({
      res,
      statusCode: 200,
      payload: enrichedUsers,
      message: `Success to fetch Github user profiles based on search query`,
      key: "users",
      pagination,
    });
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const message =
      statusCode === 403
        ? "GitHub API rate limit exceeded"
        : "GitHub search failed";

    console.error(`❌ GitHub error (${statusCode}):`, error.message);

    return errorResponse({
      res,
      statusCode,
      message,
      error: error.response?.data || error.message,
    });
  }
};

/**
 * Find a GitHub user by ID.
 *
 * @async
 * @function findGitHubUserProfileController
 *
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} req.query.github_user_id - GitHub user ID
 * @param {Object} res - Express response object
 *
 * @returns {Promise<Object>} JSON with user profile data
 */
export const findGitHubUserProfileController = async (req, res) => {
  const { github_user_id } = req.query;

  try {
    // const { data } = await axios.get(
    //   `${process.env.NEXT_PUBLIC_GITHUB_USER}/${github_user_id}`
    // );

    const fullData = await fetchGithubUserByLogin(github_user_id);
    return successResponse({
      res,
      statusCode: 200,
      payload: fullData,
      message: "Success to fetch github user profile",
      key: "user",
    });
  } catch (error) {
    console.error("❌ GitHub user fetch error:", error.message);
    return errorResponse({
      res,
      statusCode: 500,
      message: "GitHub user fetch failed",
      error: error.message,
    });
  }
};
