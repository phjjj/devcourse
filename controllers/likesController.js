// 박해준
const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const verify = require("../auth");

const postAddLike = (req, res) => {
  const { id: liked_book_id } = req.params;

  let authorization = verify(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 만료 다시 로그인" });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰" });
  } else if (authorization instanceof ReferenceError) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "로그인 필요" });
  } else {
    const sql = `INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)`;
    const values = [authorization.id, liked_book_id];
    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      return res.status(StatusCodes.OK).json({ message: "좋아요 추가 완료" });
    });
  }
};

const deleteRemoveLike = (req, res) => {
  const { id: liked_book_id } = req.params;

  let authorization = verify(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 만료 다시 로그인" });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰" });
  }

  const sql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?`;
  const values = [authorization.id, liked_book_id];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json({ message: "좋아요 삭제 완료" });
  });
};

// function verify(req, res) {
//   try {
//     let receivedjwt = req.headers["authorization"];
//     let decodedJwt = jwt.verify(receivedjwt, process.env.PRIVATE_KEY);

//     return decodedJwt;
//   } catch (err) {
//     console.log(err.name);
//     console.log(err.message);

//     return err;
//   }
// }

module.exports = { postAddLike, deleteRemoveLike };
