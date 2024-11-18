import ErrorHandler from "../utils/errorhandler.js";

const errorCheck = async (err, req, res, next) => {
  // Defaults error messages
  err.statusCode = err.statusCode || 500
  err.message = err.message || "Internal Server Error"

  // MongoDB ID error
  if (err.name === "CastError") {
    err = new ErrorHandler("Resource not found. Invalid: " + err.path, 400)
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    err = new ErrorHandler(`Duplicate ${Object.keys(err.keyValue)} entered.`, 400)
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("JSON web token is invalid, try again.", 400)
  }

  // JWT expire error
  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("JSON web token is expired, try again.", 400)
  }

  // Return and end request
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default errorCheck