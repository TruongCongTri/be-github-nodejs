export function successResponse({ res, status, data, message }) {
  if (data) {
    return res.status(status).json({
      data: { data },
      meta: {
        success: true,
        message,
      },
    });
  }
  return res.status(status).json({
    meta: {
      success: true,
      message,
    },
  });
}

export function errorResponse({ res, status, message, error }) {
  return res.status(status).json({
    meta: {
      success: false,
      message,
      error,
    },
  });
}
