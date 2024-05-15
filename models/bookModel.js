const pool = require("../mariadb");

// 전체 도서 조회
const findAllBooks = async (category_id, news, limit, offset) => {
  let bookQuery = `
    SELECT 
        books.*,
        (
            SELECT COUNT(*)
            FROM likes
            WHERE likes.liked_book_id = books.id
        ) AS likes
    FROM
        books`;

  const values = [];

  if (category_id && news) {
    const categoryAndNewsQuery =
      " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) AND NOW()";
    bookQuery += categoryAndNewsQuery;

    values.push(category_id);
  } else if (category_id) {
    const categoryQuery = " WHERE category_id = ?";
    bookQuery += categoryQuery;

    values.push(category_id);
  } else if (news) {
    const newsQuery = " WHERE pub_date BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) AND NOW()";
    bookQuery += newsQuery;
  }

  const limitQuery = " LIMIT ? OFFSET ?";
  bookQuery += limitQuery;

  values.push(parseInt(limit), offset);

  const [results] = await pool.query(bookQuery, values);

  return results;
};

// 총 도서 수 조회
const getTotalBookCount = async (category_id, news) => {
  let countQuery = "SELECT COUNT(*) AS total_count FROM books";
  const values = [];

  if (category_id && news) {
    const categoryAndNewsQuery =
      " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) AND NOW()";
    countQuery += categoryAndNewsQuery;

    values.push(category_id);
  } else if (category_id) {
    const categoryQuery = " WHERE category_id = ?";
    countQuery += categoryQuery;

    values.push(category_id);
  } else if (news) {
    const newsQuery = " WHERE pub_date BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) AND NOW()";
    countQuery += newsQuery;
  }

  const result = await pool.query(countQuery, values);

  return result[0].total_count;
};

// 비로그인 시 도서 정보 조회
const findBookForGuest = async (book_id) => {
  const bookDetailQuery = `
    SELECT 
        books.*,
        (
            SELECT COUNT(*)
            FROM likes
            WHERE likes.liked_book_id = books.id
        ) AS likes
    FROM
        books
    WHERE
        books.id = ?`;

  const [result] = await pool.query(bookDetailQuery, [book_id]);

  return result[0];
};

// 로그인 시 도서 정보 조회
const findBookForLoggedInUser = async (book_id, user_id) => {
  const bookDetailQuery = `
    SELECT 
        books.*,
        (
            SELECT COUNT(*)
            FROM likes
            WHERE likes.liked_book_id = books.id
        ) AS likes,
        (
            SELECT COUNT(*)
            FROM likes
            WHERE likes.liked_book_id = books.id AND likes.user_id = ?
        ) AS is_liked
    FROM
        books
    WHERE
        books.id = ?`;

  const [result] = await pool.query(bookDetailQuery, [user_id, book_id]);

  return result[0];
};

// 카테고리별 도서 조회
const findBooksByCategory = async (category_id) => {
  const findByCategoryQuery = "SELECT * FROM books WHERE category_id = ?";
  const [result] = await pool.query(findByCategoryQuery, [category_id]);

  return result;
};

module.exports = { findAllBooks, getTotalBookCount, findBookForGuest, findBookForLoggedInUser, findBooksByCategory };
