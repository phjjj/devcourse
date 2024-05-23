const pool = require("../mariadb");
// 장바구니 불러오기 model
const findCart = async (userId, selected) => {
  let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
                FROM cartItems LEFT JOIN books 
                ON cartItems.book_id = books.id
                WHERE user_id=?`;
  const values = [userId];

  if (selected.length) {
    // 주문서 작성 시 '선택한 장바구니 목록 조회'
    sql += ` AND cartItems.id IN (?)`;
    values.push(selected);
  }
  const [results] = await pool.query(sql, values);

  return results;
};

// 장바구니 담기 model
const addCart = async (book_id, quantity, userId) => {
  const sql = `INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);`;
  const values = [book_id, quantity, userId];

  const [results] = await pool.query(sql, values);
  return results;
};

// 장바구니 삭제하기 model
const removeCart = async (cartItemsId) => {
  const sql = `DELETE FROM cartItems WHERE id = ?`;
  const [results] = await pool.query(sql, cartItemsId);

  return results;
};

module.exports = { findCart, addCart, removeCart };
