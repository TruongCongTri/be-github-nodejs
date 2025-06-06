import { db } from "../../services/firebase.js";
import { fetchGithubUserById } from "../github/fetchGithubUserById.js";

import pLimit from "p-limit";
const limit = pLimit(5);

/**
 * Load a user's profile with their liked GitHub user by their phone number.
 * Includes caching and GitHub API fallback.
 * @param {string} phone_number - User phone number
 * @returns {Promise<{userProfiles: Array, isRateLimited: boolean}>}
 */
export const getUserProfileByPhoneNumber = async (phone_number) => {
  // Check Firestore 
  const doc = await db.collection("users").doc(phone_number).get();

  if (!doc.exists) {
    return {
      userProfiles: [],
      isRateLimited: false,
    };
  }

  // Check if user's have liked data
  const favorite_github_users = doc.data()?.favorite_github_users || [];

  if (!Array.isArray(favorite_github_users) || favorite_github_users.length === 0) {
    return {
      userProfiles: [],
      isRateLimited: false,
    };
  }

  // enrich github user's profile
  const userProfiles = await Promise.all(
    favorite_github_users.map((id) =>
      limit(async () => {
        const userData = await fetchGithubUserById(id);
        return { id, ...userData };
      })
    )
  );

  const isRateLimited = userProfiles.some((u) => u.statusCode === 403);

  return { userProfiles, isRateLimited };
};
