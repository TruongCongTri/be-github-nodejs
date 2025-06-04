import axios from "axios";
import "dotenv/config";
import {
  successResponse,
  errorResponse,
} from "../helpers/responses/response.js";
import { extractGithubData } from "../utils/extractGithubData.js";

import { fetchGithubUserByLogin } from "../helpers/github/fetchGithubUserByLogin.js";

//
import pLimit from "p-limit";
const limit = pLimit(5); // limit 5 concurrent GitHub requests
//
import { db } from "../services/firebase.js";

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

  if (!q || typeof q !== "string") {
    return errorResponse({
      res,
      statusCode: 422,
      message: "Invalid query parameter: 'q' is required",
      error: "Missing or invalid search term",
    });
  }

  try {
    
    const searchRes = await axios.get(
      process.env.NEXT_PUBLIC_GITHUB_SEARCH_USER,
      {
        params: { q, page, per_page },
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const rawUsers = searchRes.data.items;

    const enrichedUsers = await Promise.all(
      rawUsers.map((user) =>
        limit(async () => {
          const fullData = await fetchGithubUserByLogin(user.login);

          // Cache into central collection `github_users` by GitHub ID
          if (fullData?.id) {
            await db
              .collection("github_users")
              .doc(`${fullData.id}`)
              .set(fullData, { merge: true });
          }

          return fullData;
        })
      )
    );
    // const enrichedUsers = await Promise.all(
    //   rawUsers.map(async (user) => {
    //     const fullData = await fetchGithubUserByLogin(user.login);
    //     return fullData;
    //   })
    // );

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
    console.error("❌ GitHub user fetch error:", error.message);
    return errorResponse({
      res,
      statusCode: 500,
      message: "GitHub user fetch failed",
      error: error.message,
    });
  }
};
