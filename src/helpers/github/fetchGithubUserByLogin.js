import axios from "axios";
import "dotenv/config";
import { githubUserCache } from "../../libs/cache/githubUserCache.js";

/**
 * Fetch detailed GitHub user profile by login name.
 *
 * @param {string} login - GitHub login name (username)
 * @returns {Promise<Object|null>} GitHub user profile data or null if failed
 */
export const fetchGithubUserByLogin = async (login) => {
  // Check in-memory cache
  const cached = githubUserCache.get(login);
  if (cached) return cached;

  // Check Firestore cache
  const cacheDocRef = db.collection("github_users").doc(`${login}`);
  const cacheDoc = await cacheDocRef.get();
  if (cacheDoc.exists) {
    const firestoreData = cacheDoc.data();
    githubUserCache.set(login, firestoreData);
    return firestoreData;
  }

  try {
    // GitHub API request
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_GITHUB_USERS}/${login}`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    // Update all caches
    githubUserCache.set(login, data); // Update memory cache
    // Save to Firestore
    await await db
      .collection("github_users")
      .doc(`${id}`)
      .set(data, { merge: true }); // Cache by ID
    await cacheDocRef.set(data, { merge: true }); // Cache by login
    return data;
  } catch (error) {
    const statusCode = error.response?.status || 500;

    // GitHub Rate Limit fallback (re-check)
    if (statusCode === 403) {
      console.warn(
        `⚠️ GitHub rate limit hit. Trying Firestore fallback for Login ${login}`
      );
      // Fallback to Firestore cache
      const fallbackDoc = await db
        .collection("github_users")
        .doc(`${login}`)
        .get();
      if (fallbackDoc.exists) {
        const fallbackData = fallbackDoc.data();
        // Update in-memory cache
        githubUserCache.set(login, fallbackData);
        return fallbackData;
      }
    }

    const message =
      statusCode === 403
        ? "GitHub rate limit reached"
        : `Failed to fetch user with Login '${login}'`;

    console.error(`❌ ${message}:`, error.message);

    return {
      login,
      error: message,
      statusCode,
    };
  }
};
