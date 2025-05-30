/**
 * Extracts users and pagination info from GitHub search API response.
 *
 * @param {Object} githubResponse - GitHub API JSON response
 * @param {number} currentPage - Current page number
 * @param {number} perPage - Number of items per page
 * 
 * @returns {Object} Object containing users array and pagination metadata
 */
export const extractGithubData = (githubResponse, currentPage, perPage) => {
  const total = githubResponse.total_count || 0;
  const totalPages = Math.ceil(total / perPage);

  return {
    users: githubResponse || [],
    pagination: {
      current_page: currentPage,
      per_page: perPage,
      total,
      total_pages: totalPages,
    },
  };
};
