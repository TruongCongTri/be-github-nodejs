import {
  successResponse,
  errorResponse,
} from "../helpers/responses/response.js";
import { extractGithubData } from "../utils/extractGithubData.js";
import axios from "axios";

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

  try {
    const searchRes = await axios.get(
      process.env.NEXT_PUBLIC_GITHUB_SEARCH_USER,
      {
        params: { q, page, per_page },
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`, // use token to avoid rate limit
        },
      }
    );

    const items = searchRes.data.items;
    const enriched = await Promise.all(
      items.map(async (user) => {
        try {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_GITHUB_USERS}/${user.login}`,
            {
              headers: {
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
              },
            }
          );

          return data;
        } catch (err) {
          console.error(`❌ Failed to fetch details for ${user.login}`);
          return null;
        }
      })
    );
    console.log(enriched);

    const { users, pagination } = extractGithubData(
      enriched,
      Number(page),
      Number(per_page)
    );
    return successResponse({
      res,
      statusCode: 200,
      payload: users,
      message: `Success to fetch Github user profiles based on search query`,
      key: "users",
      pagination,
    });
  } catch (error) {
    console.error("❌ GitHub search error:", error.message);
    return errorResponse({
      res,
      statusCode: 500,
      message: "GitHub search failed",
      error: error.message,
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
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_GITHUB_USER}/${github_user_id}`
    );
    return successResponse({
      res,
      statusCode: 200,
      payload: data,
      message: "Success to fetch github user profile",
      key: "user",
    });
  } catch (error) {
    console.error("❌ GitHub user fetch error:", err.message);
    return errorResponse({
      res,
      statusCode: 500,
      message: "GitHub user fetch failed",
      error: error.message,
    });
  }
};
