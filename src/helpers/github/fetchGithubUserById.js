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
  // in-memory cache
  const cached = githubUserCache.get(id);
  if (cached) return cached;

  // Firestore fallback
  const cacheDocRef = db.collection("github_users").doc(`${id}`);
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

    // Set all caches
    githubUserCache.set(id, data); // Update memory cache
    await cacheDocRef.set(data, { merge: true }); // Save to Firestore
    return data;
  } catch (error) {
    const statusCode = error.response?.status || 500;
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
        // Update in-memory & Redis for faster next access
        githubUserCache.set(id, fallbackData);
        await redis.set(cacheKey, JSON.stringify(fallbackData), "EX", 3600);
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
