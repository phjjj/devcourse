const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(StatusCodes.UNAUTHORIZED).json({ errors: errorMessages });
  }
  next();
};

module.exports = validationMiddleware;
