export function successResponse({ res, status, data, message }) {
  if (data) {
    return res.status(status).json({
      data: { data },
      meta: {
        status,
        message,
      },
    });
  }
  return res.status(status).json({
    meta: {
      status,
      message,
    },
  });
}

export function errorResponse({ res, status, message }) {
  return res.status(status).json({
    meta: {
      status,
      message,
    },
  });
}
