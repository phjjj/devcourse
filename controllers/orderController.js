// 박해준
const { StatusCodes } = require("http-status-codes");
const conn = require("../mariadb");
const mariadb = require("mysql2/promise");
const verify = require("../auth");

// 주문하기
const postOrder = async (req, res) => {
  // 비동기 처리로 DB연결
  const conn = await mariadb.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "Bookshop",
    dateStrings: true,
  });

  let authorization = verify(req, res);

  // instanceof
  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 만료 다시 로그인" });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰" });
  }

  // itmes=책,수량, 배송지, 총 수량, 합계, userId, 대표 책
  else {
    const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body;

    // 정보 전달 변수 선언
    let delivery_id;
    let order_id;
    let orderItmes;

    // 배송정보 테이블에 추가
    let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?);`;
    let values = [delivery.address, delivery.receiver, delivery.contact];

    try {
      const [deliveryResult] = await conn.execute(sql, values);
      delivery_id = deliveryResult.insertId;
    } catch (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    // orders 테이블에 추가하기
    // 유저가 주문 목록에 들어 갈 경우 해당 테이블을 조회 할 듯
    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
            VALUES (?, ?, ?, ?, ?);`;
    values = [firstBookTitle, totalQuantity, totalPrice, authorization.id, delivery_id];

    try {
      const [orderResult] = await conn.execute(sql, values);
      order_id = orderResult.insertId;
    } catch (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    // itmes(장바구니에서 선택된 정보)를 가지고, book_id, quantity 조회 후 삭제
    sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
    try {
      [orderItmes] = await conn.query(sql, [items]);
    } catch (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    // orderBook 테이블에 추가하기
    // 관계형을 위해 만든 것?
    // 전체 주문 조회를 위해 만든 것?
    sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?;`;
    values = [];
    orderItmes.forEach((item) => {
      values.push([order_id, item.book_id, item.quantity]);
    });

    try {
      const [orderedBookResult] = await conn.query(sql, [values]); // [values]를 사용하면 한번에 여러 행 추가한다
      await deleteCartItems(conn, items); // 장바구니에서 주문된 상품 삭제
      return res.status(StatusCodes.OK).json(orderedBookResult);
    } catch (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
  }
};

const deleteCartItems = async (conn, items) => {
  let sql = `DELETE FROM cartItems WHERE id IN (?)`;

  let results = await conn.query(sql, [items]);
  return results;
};

const getOrders = async (req, res) => {
  const conn = await mariadb.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "Bookshop",
    dateStrings: true,
  });

  let authorization = verify(req, res);

  // instanceof
  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 만료 다시 로그인" });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰" });
  } else {
    let sql = `SELECT orders.id, created_at, address, contact, receiver, book_title, total_quantity, total_price,
            FROM orders 
            LEFT JOIN delivery 
            ON orders.delivery_id = delivery_id`;
    let [orderListResults] = await conn.query(sql);

    res.status(StatusCodes.OK).json(orderListResults);
  }
};

const getOrderDetail = async (req, res) => {
  const conn = await mariadb.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "Bookshop",
    dateStrings: true,
  });
  const { id: orderId } = req.params;

  let authorization = verify(req, res);

  // instanceof
  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 만료 다시 로그인" });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰" });
  } else {
    let sql = `SELECT book_id, title, author, price, quantity
            FROM orderedBook 
            LEFT JOIN books 
            ON orderedBook.id = books.id
            WHERE order_id = ?`;

    let values = [orderId];
    let [orderDetailListResults] = await conn.query(sql, values);
    res.status(StatusCodes.OK).json(orderDetailListResults);
  }
};

module.exports = {
  postOrder,
  getOrders,
  getOrderDetail,
};
