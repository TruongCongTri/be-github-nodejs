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
  const cached = githubUserCache.get(login);
  if (cached) return cached;

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_GITHUB_USERS}/${login}`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    // Cache and return the data
    githubUserCache.set(login, data);
    return data;
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const message =
      statusCode === 403
        ? "GitHub rate limit reached"
        : `Failed to fetch user '${login}'`;

    console.error(`❌ ${message}:`, error.message);

    return {
      login,
      error: message,
      statusCode,
    };
  }
};
