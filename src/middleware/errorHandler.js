const errorHandler = (err, req, res, next) => {
  console.error("API Error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Handle Supabase errors
  let message = err.message;
  if (err.code === "PGRST116") {
    message = "Resource not found";
    statusCode = 404;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Async error wrapper
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  catchAsync,
};
