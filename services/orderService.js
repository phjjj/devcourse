// orderService.js
const orderModel = require("../models/orderModel");
// 주문하기
const order = async (items, delivery, firstBookTitle, totalQuantity, totalPrice, userId) => {
  try {
    let delivery_id;
    let order_id;
    let orderItems;

    // 배송정보 테이블에 추가
    const deliveryResult = await orderModel.addDelivery(delivery);
    delivery_id = deliveryResult.insertId;

    // orders 테이블에 추가하기
    const orderResult = await orderModel.addOrders(firstBookTitle, totalQuantity, totalPrice, userId, delivery_id);

    order_id = orderResult.insertId;

    // itmes(장바구니에서 선택된 정보)를 가지고, book_id, quantity 조회 후 삭제
    orderItems = await orderModel.getCartItems(items);
    await orderModel.deleteCartItems(items);
    // orderBook 테이블에 추가하기
    const orderedBookResult = await orderModel.addOrderedBook(order_id, orderItems);
    return orderedBookResult;
  } catch (err) {
    throw new Error(err);
  }
};

// 주문내역 조회
const getOrders = async (userId) => {
  try {
    const orderListResults = await orderModel.findOrders(userId);
    return orderListResults;
  } catch (err) {
    throw new Error(err);
  }
};

// 주문 상세 조회
const getOrderDetail = async (orderId) => {
  try {
    const orderDetailResults = await orderModel.findOrderDetail(orderId);
    return orderDetailResults;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { order, getOrders, getOrderDetail };
