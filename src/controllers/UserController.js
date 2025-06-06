import "dotenv/config";

import admin from "firebase-admin";
import { db } from "../services/firebase.js";

import {
  successResponse,
  errorResponse,
} from "../helpers/responses/response.js";

import { fetchGithubUserById } from "../helpers/github/fetchGithubUserById.js";
import { getUserProfileByPhoneNumber } from "../helpers/user/getUserProfileByPhoneNumber.js";

//
// import pLimit from "p-limit";
// const limit = pLimit(5);

/**
 * Save a liked GitHub user ID to a user's document in Firestore.
 *
 * @async
 * @function likeGitHubUserController
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.phone_number - User's phone number
 * @param {number} req.body.github_user_id - GitHub user ID
 * @param {Object} res - Express response object
 *
 * @returns {Promise<Object>} JSON response indicating success
 */
export const likeGitHubUserController = async (req, res) => {
  const { phone_number, github_user_id } = req.body;

  try {
    const githubUserData = await fetchGithubUserById(github_user_id);
    // Save to global github_users cache (if valid data)
    if (githubUserData?.error) {
      return errorResponse({
        res,
        statusCode: 400,
        message: "Failed to retrieve GitHub profile",
        error: githubUserData.error,
      });
    }
    // Save user-specific like
    const userRef = db.collection("users").doc(phone_number);
    const githubCacheRef = userRef
      .collection("cached_users")
      .doc(`${github_user_id}`);

    await Promise.all([
      userRef.set(
        {
          favorite_github_users:
            admin.firestore.FieldValue.arrayUnion(github_user_id),
        },
        { merge: true }
      ),
      githubCacheRef.set(githubUserData, { merge: true }),
    ]);

    return successResponse({
      res,
      statusCode: 200,
      message: "Success to like Github user",
    });
  } catch (error) {
    console.error("❌ Like GitHub user error:", error.message);
    return errorResponse({
      res,
      statusCode: 500,
      message: "Failed to like GitHub user",
      error: error.message,
    });
  }
};

/**
 * Retrieve user's profile including details of liked GitHub users.
 *
 * @async
 * @function getUserProfileController
 *
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.phone_number - User's phone number
 * @param {Object} res - Express response object
 *
 * @returns {Promise<Object>} JSON response with user's liked GitHub profiles
 */
export const getUserProfileController = async (req, res) => {
  const { phone_number } = req.query;

  try {
    const doc = await getUserProfileByPhoneNumber(phone_number);

    return successResponse({
      res,
      statusCode: doc.isRateLimited ? 207 : 200, // 207 = Multi-Status (some failed)
      payload: {
        phone_number,
        favorite_github_users: doc.userProfiles,
      },
      message: doc.isRateLimited
        ? "Partial success: some GitHub profiles may be rate-limited"
        : "Success to fetch user profile",
      key: "user",
    });
  } catch (error) {
    console.error("❌ User fetch error:", error.message);
    return errorResponse({
      res,
      statusCode: 500,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};
