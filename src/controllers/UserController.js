import axios from "axios";
import "dotenv/config";

import admin from "firebase-admin";
import { db } from "../services/firebase.js";

import {
  successResponse,
  errorResponse,
} from "../helpers/responses/response.js";

import { fetchGithubUserById } from "../helpers/github/fetchGithubUserById.js";

//
import pLimit from "p-limit";
const limit = pLimit(5);

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
    if (!githubUserData?.error) {
      await db
        .collection("github_users")
        .doc(`${github_user_id}`)
        .set(githubUserData, { merge: true });
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
  console.log(phone_number);

  if (!phone_number || typeof phone_number !== "string") {
    return errorResponse({
      res,
      statusCode: 422,
      message: "Missing or invalid 'phone_number' query parameter",
      error: "Query param 'phone_number' is required and must be a string",
    });
  }

  try {
    const doc = await db.collection("users").doc(phone_number).get();
    // console.log("doc");
    // console.log(doc);
    
    if (!doc.exists) {
      return successResponse({
        res,
        statusCode: 200,
        payload: {
          phone_number,
          favorite_github_users: [],
        },
        message: "User does not exist yet",
        key: "user",
      });
    }
    const data = doc.data();
    // console.log(data);
    
    const favorite_github_users = data?.favorite_github_users || [];
    // console.log(favorite_github_users);
    
    if (
      !Array.isArray(favorite_github_users) ||
      favorite_github_users.length === 0
    ) {

      return successResponse({
        res,
        statusCode: 200,
        payload: {
          phone_number,
          favorite_github_users: [],
        },
        message: "User has no favorite GitHub users",
        key: "user",
      });
    }


    // Fetch full profile for each GitHub user ID with throttling
    const userProfiles = await Promise.all(
      favorite_github_users.map((id) =>
        limit(async () => {
          const userData = await fetchGithubUserById(id);
          return { id, ...userData };
        })
      )
    );
    // console.log(userProfiles);
    

    const isRateLimited = userProfiles.some((u) => u.statusCode === 403);
    
    return successResponse({
      res,
      statusCode: isRateLimited ? 207 : 200, // 207 = Multi-Status (some failed)
      payload: {
        phone_number,
        favorite_github_users: userProfiles,
      },
      message: isRateLimited
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

/**
 * Retrieve liked GitHub ids.
 *
 * @async
 * @function getUserProfileController
 *
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.phone_number - User's phone number
 * @param {Object} res - Express response object
 *
 * @returns {Promise<Object>} JSON response liked GitHub ids
 */
export const getLikedGithubController = async (req, res) => {
  const { phone_number } = req.query;

  try {
    const doc = await db.collection("users").doc(phone_number).get();
    if (!doc.exists)
      return errorResponse({ res, status: 404, message: "User not found" });

    const { favorite_github_users = [] } = doc.data();

    return res.status(200).json({
      phone_number,
      favorite_github_ids: favorite_github_users,
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
