// 박해준
const { body, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const conn = require("../mariadb");
const jwt = require("jsonwebtoken");
const verify = require("../auth");

const getAllBooks = (req, res) => {
  let allBooksRes = {};
  const { category_id, news, limit, currentPage } = req.query;

  let offset = limit * (currentPage - 1);
  let values = [];
  let sql =
    "SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes WHERE books.id=liked_book_id) AS likes FROM books";

  if (category_id && news) {
    sql += " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) AND NOW()";
    values = [category_id];
  } else if (category_id) {
    sql += " WHERE category_id = ?";
    values = [category_id];
  } else if (news) {
    sql += " WHERE pub_date BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) AND NOW()";
  }

  sql += ` LIMIT ? OFFSET ?`;
  values = [...values, parseInt(limit), offset];

  conn.query(sql, values, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    } else {
      if (results.length) {
        results.map((result) => {
          result.pubDate = result.pub_date;
          delete result.pub_date;
        });
        allBooksRes.books = results;
      } else {
        res.status(404).json({ message: "비어있음" });
      }
    }
  });

  sql = "SELECT found_rows()";
  conn.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    let pagination = {};
    pagination.currentPage = parseInt(currentPage);
    pagination.totalCount = results[0]["found_rows()"];

    allBooksRes.pagination = pagination;
    return res.status(StatusCodes.OK).json(allBooksRes);
  });
};

const getBook = (req, res) => {
  const { id: book_id } = req.params;

  let authorization = verify(req, res);

  // instanceof
  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 만료 다시 로그인" });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰" });
  } else if (authorization instanceof ReferenceError) {
    // 로그인을 하지 않은 상태
    const sql = `SELECT * ,
        (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes
      FROM books
      LEFT JOIN category 
      ON books.category_id = category.category_id
      WHERE books.id = ?`;
    const values = [book_id];

    conn.query(sql, values, (err, results) => {
      if (err) {
        return res.status(500).json(err);
      } else {
        if (results[0]) {
          console.log("토큰이 없을 때");
          return res.status(200).json(results[0]);
        } else {
          return res.status(404).json({ message: "Not Found" });
        }
      }
    });
  } else {
    const sql = `SELECT * ,
      (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes,
      (SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked
    FROM books
    LEFT JOIN category 
    ON books.category_id = category.category_id
    WHERE books.id = ?`;

    const values = [authorization.id, book_id, book_id];

    conn.query(sql, values, (err, results) => {
      if (err) {
        res.status(500).json(err);
      } else {
        if (results[0]) {
          res.status(200).json(results[0]);
        } else {
          res.status(404).json({ message: "Not Found" });
        }
      }
    });
  }
};

const getBooksByCategory = (req, res) => {
  // ?category_id=1
  const { category_id } = req.query;
};

module.exports = { getAllBooks, getBook, getBooksByCategory };
