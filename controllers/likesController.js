// 박해준
const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const verify = require("../auth");
const pool = require("../mariadb");
const jwtUtil = require("../utils/jwtUtil");

const postAddLike = (req, res) => {
  const { id: liked_book_id } = req.params;
  const token = req.headers.authorization.split(" ")[1];

  // 토큰이 있을 때
  if (token) {
    const decoded = jwtUtil.decodeToken(token);

    const user_id = decoded.id;
    const sql = `INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)`;
    const values = [user_id, liked_book_id];
    const result = conn.query(sql, values);

    return res.status(StatusCodes.OK).json({ message: "좋아요 추가 완료" });
  } else {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인이 필요합니다" });
  }
};

const deleteRemoveLike = (req, res) => {
  const { id: liked_book_id } = req.params;
  const token = req.headers.authorization.split(" ")[1];

  // 토큰이 있을 때
  if (token) {
    const decoded = jwtUtil.decodeToken(token);

    const user_id = decoded.id;
    const sql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?`;
    const values = [user_id, liked_book_id];
    const result = conn.query(sql, values);

    return res.status(StatusCodes.OK).json({ message: "좋아요 삭제 완료" });
  } else {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인이 필요합니다" });
  }
};

module.exports = { postAddLike, deleteRemoveLike };
