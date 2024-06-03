// 박해준
const { StatusCodes } = require("http-status-codes");
const pool = require("../mariadb");
const crypto = require("crypto");
const UserService = require("../services/userService");
const UserModel = require("../models/userModel");
const jwtUtil = require("../utils/jwtUtil");

// 회원가입
const postJoin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const success = await UserService.createUser(email, password);

    if (success) {
      return res.status(StatusCodes.CREATED).json({ message: "회원가입 성공" });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).end("잘못된 요청");
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// 로그인
const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.loginUser(email, password);

    if (user) {
      // jwt 생성하기
      const accessToken = jwtUtil.generateAccessToken(user);
      const refreshToken = jwtUtil.generateRefreshToken(user);

      res.setHeader("Authorization", `Bearer ${accessToken}`); // 헤더에 액세스 토큰 저장
      res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" }); // 리프레시 토큰은 쿠키에 저장
      res.status(StatusCodes.CREATED).json({ message: "로그인 성공" });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end("잘못된 요청");
    }
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
  }
};

// 비밀번호 수정 요청
const postPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findUserByEmail(email);

    if (user) {
      return res.status(StatusCodes.OK).json({ message: "인증성공" });
    }
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).end(error.message);
  }
};

// 비밀번호 수정
const putPasswordReset = async (req, res) => {
  try {
    const { email, password } = req.body;
    const success = await UserService.passwordReset(email, password);
    if (success) {
      return res.status(StatusCodes.OK).json({ message: "비밀번호 수정 성공" });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).end("잘못된 요청");
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// 좋아요 추가
const putLikes = (req, res) => {
  res.status(200).json({ message: "좋아요 추가/취소" });
};

module.exports = {
  postLogin,
  postJoin,
  postPasswordReset,
  putPasswordReset,
  putLikes,
};
