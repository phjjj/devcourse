const pool = require("../mariadb");
// delivery 테이블에추가
const addDelivery = async ({ address, receiver, contact }) => {
  let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?);`;
  let values = [address, receiver, contact];

  const [result] = await pool.query(sql, values);
  return result;
};
// orders 테이블에 추가
const addOrders = async (firstBookTitle, totalQuantity, totalPrice, userId, delivery_id) => {
  let sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
                VALUES (?, ?, ?, ?, ?);`;
  let values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];

  const [result] = await pool.query(sql, values);
  return result;
};
// cartItems 테이블에서 삭제
const deleteCartItems = async (items) => {
  let sql = `DELETE FROM cartItems WHERE id IN (?)`;
  const [result] = await pool.query(sql, [items]);

  return result;
};
// cartItems 테이블에서 선택한 아이템 조회
const getCartItems = async (items) => {
  let sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
  const [result] = await pool.query(sql, [items]);

  return result;
};

// orderedBook 테이블에 추가
const addOrderedBook = async (order_id, orderItems) => {
  let sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?;`;
  let values = [];
  orderItems.forEach((item) => {
    values.push([order_id, item.book_id, item.quantity]);
  });

  const result = await pool.query(sql, [values]);
  return result;
};

const findOrders = async (userId) => {
  let sql = `SELECT user_id, orders.id, created_at, address, contact, receiver, book_title, total_quantity, total_price
FROM orders 
LEFT JOIN delivery 
ON orders.delivery_id = delivery.id
WHERE orders.user_id = ?`;
  const [result] = await pool.query(sql, [userId]);
  return result;
};

const findOrderDetail = async (orderId) => {
  let sql = `SELECT book_id, title, author, price, quantity
                FROM orderedBook
                LEFT JOIN books
                ON orderedBook.book_id = books.id
                WHERE order_id = ?`;
  const [result] = await pool.query(sql, [orderId]);
  return result;
};

module.exports = {
  findOrderDetail,
  addDelivery,
  addOrders,
  deleteCartItems,
  addOrderedBook,
  getCartItems,
  findOrders,
  findOrders,
};
