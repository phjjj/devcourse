// services/UserService.js
const UserModel = require("../models/usersModel");
const crypto = require("crypto");

const createUser = async (email, password) => {
  try {
    const salt = crypto.randomBytes(10).toString("base64");
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, "sha512").toString("base64");
    const success = await UserModel.createUser(email, hashPassword, salt);

    return success;
  } catch (error) {
    throw new Error("회원가입 실패: " + error.message);
  }
};

module.exports = { createUser };
