import axios from "axios";
import "dotenv/config";

/**
 * Search GitHub users using the official API.
 * @param {string} q - Search query
 * @param {number} page - Page number
 * @param {number} per_page - Results per page
 * @returns {Promise<Object>} - Full GitHub API response
 */
export const searchGithubUsers = async (q, page = 1, per_page = 10) => {
  // GitHub API request
  return axios.get(process.env.NEXT_PUBLIC_GITHUB_SEARCH_USER, {
    params: { q, page, per_page },
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
};
