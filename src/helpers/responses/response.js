export function successResponse({ res, status, success, data, message }) {
  if (data) {
    return res.status(status).json({
      data: { data },
      meta: {
        success,
        message,
      },
    });
  }
  return res.status(status).json({
    meta: {
      success,
      status,
      message,
    },
  });
}

export function errorResponse({ res, status, success, message, error }) {
  return res.status(status).json({
    meta: {
      success,
      message,
      error,
    },
  });
}
