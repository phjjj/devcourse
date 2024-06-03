const express = require("express");
const { postLogin, postJoin, putPasswordReset, postPasswordReset, putLikes } = require("../controllers/userController");
const { body } = require("express-validator");
const validationMiddleware = require("../middleware/validationMiddleware");
const { emailValidator, passwordValidator } = require("../middleware/validationRulesMiddleware");
const rootRouter = express.Router();

rootRouter.post("/join", [emailValidator, passwordValidator], validationMiddleware, postJoin);
rootRouter.post("/login", [emailValidator, passwordValidator], validationMiddleware, postLogin);
rootRouter
  .route("/reset")
  .post([emailValidator], validationMiddleware, postPasswordReset)
  .put([emailValidator, passwordValidator], validationMiddleware, putPasswordReset);

module.exports = rootRouter;
