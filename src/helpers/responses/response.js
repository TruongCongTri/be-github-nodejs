/**
 * Sends a standardized success JSON response.
 *
 * @function successResponse
 * @param {Object} options - Options for response
 * @param {Object} options.res - Express response object
 * @param {Object|Array} [options.payload={}] - Data to return in response
 * @param {number} [options.statusCode=200] - HTTP status code
 * @param {string} [options.message='Success'] - Message to return in meta
 * @param {Object|null} [options.pagination=null] - Pagination object (current_page, per_page, total, total_pages)
 * @param {string|null} [options.key=null] - Key to wrap data in (e.g., "user", "users")
 * 
 * @returns {Object} JSON response with meta and optional data block
 */
export const successResponse = ({
  res,
  payload = {},
  statusCode = 200,
  message = "Success",
  pagination = null,
  key = null,
}) => {
  const isEmpty =
    payload == null ||
    (typeof payload === "object" && Object.keys(payload).length === 0);
  const response = {
    meta: {
      success: true,
      message,
    },
  };

  if (!isEmpty) {
    const isArray = Array.isArray(payload);
    let dataWrapper;

    //
    if (isArray) {
      dataWrapper = {};
      dataWrapper = { [key || "items"]: payload };
    } else if (
      typeof payload === "object" &&
      payload !== null &&
      Object.keys(payload).length === 1 &&
      key === null
    ) {
      dataWrapper = {};
      const [autoKey] = Object.keys(payload);
      dataWrapper = { [autoKey]: payload[autoKey] };
    } else {
      dataWrapper = { [key || "item"]: payload };
    }

    response.data = dataWrapper;
  }
  if (pagination) {
    response.meta.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};

/**
 * Sends a standardized error JSON response.
 *
 * @function errorResponse
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} [statusCode=500] - HTTP status code
 * 
 * @returns {Object} JSON response with error message and success: false
 */
export const errorResponse = ({
  res,
  message = "An error occurred",
  statusCode = 500,
  error,
}) => {
  return res.status(statusCode).json({
    data: null,
    meta: {
      success: false,
      message,
      error,
    },
  });
};
