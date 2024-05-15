// services/UserService.js
const UserModel = require("../models/userModel");
const crypto = require("crypto");

const createUser = async (email, password) => {
  try {
    const salt = crypto.randomBytes(10).toString("base64");
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, "sha512").toString("base64");
    const success = await UserModel.createUser(email, hashPassword, salt);

    return success;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("이미 존재하는 이메일입니다.");
    }
    throw new Error("회원가입 실패: " + error.message);
  }
};

const loginUser = async (email, password) => {
  try {
    const user = await UserModel.findUserByEmail(email);
    const hashPassword = crypto.pbkdf2Sync(password, user.salt, 10000, 10, "sha512").toString("base64");
    if (user.password === hashPassword && user) {
      return user;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error("로그인 실패 : " + error.message);
  }
};

const passwordReset = async (email, password) => {
  try {
    const salt = crypto.randomBytes(10).toString("base64");
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, "sha512").toString("base64");
    const success = await UserModel.updatePassword(email, hashPassword, salt);
    if (success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error("패스워드 변경 실패 : " + error.message);
  }
};

module.exports = { createUser, loginUser, passwordReset };
