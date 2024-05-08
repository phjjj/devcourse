// 박해준
const { body, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const pool = require("../mariadb");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv").config();
const UserService = require("../service/usersService");
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
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "회원가입 실패" });
  }
};

// 로그인
const getLogin = (req, res) => {
  try {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    const values = [email];

    pool.query(sql, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      const loginUser = results[0];
      const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, 10000, 10, "sha512").toString("base64");

      if (loginUser && loginUser.password == hashPassword) {
        const token = jwt.sign(
          {
            id: loginUser.id,
            email: loginUser.email,
          },
          process.env.PRIVATE_KEY,
          {
            expiresIn: "100m",
            issuer: "phj",
          }
        );
        res.cookie("token", token, {
          httpOnly: true,
        });

        return res.status(StatusCodes.OK).json(results);
      } else {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "올바르지 않은 사용자 정보" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
  }
};

// 비밀번호 초기화 요청
const postPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    console.log(user);
    if (user) {
      return res.status(StatusCodes.OK).json({ email });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

// 비밀번호 수정
const putPasswordReset = (req, res) => {
  const { email, password } = req.body;

  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, "sha512").toString("base64");

  const sql = "UPDATE users SET password = ?, salt = ? WHERE email = ?";
  const values = [hashPassword, salt, email];

  pool.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results.affectedRows === 0) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    } else {
      return res.status(StatusCodes.OK).json(results);
    }
  });
};

// 좋아요 추가
const putLikes = (req, res) => {
  res.status(200).json({ message: "좋아요 추가/취소" });
};

module.exports = {
  getLogin,
  postJoin,
  postPasswordReset,
  putPasswordReset,
  putLikes,
};