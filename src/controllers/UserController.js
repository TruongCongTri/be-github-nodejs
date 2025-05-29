import { db } from "../services/firebase.js";
import {
  successResponse,
  errorResponse,
} from "../helpers/responses/response.js";
import axios from "axios";
import admin from "firebase-admin";

/**
 * Save a liked GitHub user ID to a user's document in Firestore.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.phone_number - User's phone number
 * @param {number} req.body.github_user_id - GitHub user ID
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response indicating success
 */
export const likeGitHubUserController = async (req, res) => {
  const { phone_number, github_user_id } = req.body;

  try {
    const userRef = db.collection("users").doc(phone_number);
    await userRef.set(
      {
        favorite_github_users:
          admin.firestore.FieldValue.arrayUnion(github_user_id),
      },
      { merge: true }
    );
    return successResponse({ res, status: 200, message: `` });
  } catch (error) {
    console.error("❌ Like GitHub user error:", err.message);
    return errorResponse({
      res,
      status: 500,
      message: "Failed to like GitHub user",
      error: error.message,
    });
  }
};

/**
 * Retrieve user's profile including details of liked GitHub users.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.phone_number - User's phone number
 * @param {Object} res - Express response object
 * 
 * @returns {Object} JSON response with user's liked GitHub profiles
 */
export const getUserProfileController = async (req, res) => {
  const { phone_number } = req.query;

  try {
    const doc = await db.collection("users").doc(phone_number).get();
    if (!doc.exists)
      return errorResponse({ res, status: 404, message: "User not found" });

    const { favorite_github_users = [] } = doc.data();

    // Fetch full profile for each GitHub user ID
    const userProfiles = await Promise.all(
      favorite_github_users.map(async (id) =>
        axios
          .get(`${process.env.NEXT_PUBLIC_GITHUB_USER}/${id}`)
          .then((result) => result.data)
      )
    );

    return successResponse({
      res,
      status: 200,
      data: {
        phone_number,
        favorite_github_users: userProfiles.filter(Boolean),
      },
      message: ``,
    });
  } catch (error) {
    console.error("❌ User fetch error:", error.message);
    return errorResponse({
      res,
      status: 500,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};
