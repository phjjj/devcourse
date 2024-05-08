// 박해준
const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const verify = require("../auth");

// 장바구니 불러오기
const getCart = (req, res) => {
  const { selected } = req.body;

  let authorization = verify(req, res);

  // instanceof
  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 만료 다시 로그인" });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰" });
  } else {
    let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
                FROM cartItems LEFT JOIN books 
                ON cartItems.book_id = books.id
                WHERE user_id=?`;
    const values = [authorization.id];

    if (selected) {
      // 주문서 작성 시 '선택한 장바구니 목록 조회'
      sql += ` AND cartItems.id IN (?)`;
      values.push(selected);
    }
    // cartItmes에서 user_id와 authorization.id와 같은 것들 가져오기 book_id join하기

    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_GATEWAY).end();
      }

      res.status(200).json(results);
    });
  }
};

// 장바구니 담기
const postAddCart = (req, res) => {
  const { book_id, quantity } = req.body;

  let authorization = verify(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 만료 다시 로그인" });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰" });
  } else {
    const sql = `INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);`;
    const values = [book_id, quantity, authorization.id]; // Replace user_id with authorization.id

    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_GATEWAY).end();
      }
      res.status(200).json({ message: "장바구니 담기 성공" });
    });
  }
};

// 장바구니 삭제하기
const deleteRemovecCart = (req, res) => {
  const { id: cartItemsId } = req.params;
  const sql = `DELETE FROM cartItems WHERE id = ?`;

  let authorization = verify(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 만료 다시 로그인" });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰" });
  } else {
    conn.query(sql, cartItemsId, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_GATEWAY).end();
      } else {
        if (results.affectedRows === 0) {
          return res.status(StatusCodes.NOT_FOUND).json({ message: "삭제할 행이 없습니다." });
        }
        res.status(StatusCodes.OK).json({ message: "삭제완료" });
      }
    });
  }
};

module.exports = { postAddCart, getCart, deleteRemovecCart };
