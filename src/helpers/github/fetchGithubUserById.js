import axios from "axios";
import { db } from "../../services/firebase.js";
import "dotenv/config";
import { githubUserCache } from "../../libs/cache/githubUserCache.js";
// import { redis } from "../../libs/redis.js";

/**
 * Fetch detailed GitHub user profile by id.
 *
 * @param {string} id - GitHub Id
 * @returns {Promise<Object|null>} GitHub user profile data or null if failed
 */
export const fetchGithubUserById = async (id) => {
  // Check in-memory cache
  const cached = githubUserCache.get(id);
  if (cached) return cached;

  // Check Firestore cache
  const cacheDocRef = db.collection("github_users").doc(`${id}`);
  const cacheDoc = await cacheDocRef.get();
  if (cacheDoc.exists) {
    const firestoreData = cacheDoc.data();
    githubUserCache.set(id, firestoreData);
    return firestoreData;
  }

  try {
    // GitHub API request
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_GITHUB_USER}/${id}`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    // Update all caches
    githubUserCache.set(id, data); // Update memory cache
    await cacheDocRef.set(data, { merge: true }); // Save to Firestore
    return data;
  } catch (error) {
    const statusCode = error.response?.status || 500;

    // GitHub Rate Limit fallback (re-check)
    if (statusCode === 403) {
      console.warn(
        `⚠️ GitHub rate limit hit. Trying Firestore fallback for ID ${id}`
      );
      // Fallback to Firestore cache
      const fallbackDoc = await db
        .collection("github_users")
        .doc(`${id}`)
        .get();
      if (fallbackDoc.exists) {
        const fallbackData = fallbackDoc.data();
        // Update in-memory cache
        githubUserCache.set(id, fallbackData);
        return fallbackData;
      }
    }
    const message =
      statusCode === 403
        ? "GitHub rate limit reached"
        : `Failed to fetch user with ID '${id}'`;

    console.error(`❌ ${message}:`, error.message);

    return {
      id,
      error: message,
      statusCode,
    };
  }
};
