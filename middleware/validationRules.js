const { body } = require("express-validator");

const emailValidator = body("email").normalizeEmail().toLowerCase().isEmail().withMessage("이메일 형식을 유지해주세요");

const passwordValidator = body("password")
  .trim()
  .isLength({ min: 5 })
  .withMessage("비밀번호는 5자리 이상이어야합니다.");

module.exports = { emailValidator, passwordValidator };
