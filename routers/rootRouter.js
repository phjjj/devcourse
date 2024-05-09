const express = require("express");
const { getLogin, postJoin, putPasswordReset, postPasswordReset, putLikes } = require("../controllers/userController");
const { body } = require("express-validator");
const validationMiddleware = require("../middleware/validationMiddleware");
const { emailValidator, passwordValidator } = require("../middleware/validationRulesMiddleware");
const rootRouter = express.Router();

rootRouter.post("/join", [emailValidator, passwordValidator], validationMiddleware, postJoin);
rootRouter.get("/login", [emailValidator, passwordValidator], validationMiddleware, getLogin);
rootRouter
  .route("/reset")
  .post([emailValidator], validationMiddleware, postPasswordReset)
  .put([emailValidator, passwordValidator], validationMiddleware, putPasswordReset);

module.exports = rootRouter;
