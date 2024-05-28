// 박해준
const { StatusCodes } = require("http-status-codes");
const conn = require("../mariadb");
const mariadb = require("mysql2/promise");
const verify = require("../auth");
const orderService = require("../services/orderService");
// 주문하기
const postOrder = async (req, res) => {
  try {
    await orderService.order(req.body);
    return res.status(StatusCodes.CREATED).json("주문이 완료되었습니다.");
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// 주문내역 조회
const getOrders = async (req, res) => {
  const orderListResults = await orderService.getOrders(userId);

  res.status(StatusCodes.OK).json(orderListResults);
};

const getOrderDetail = async (req, res) => {
  const { id: orderId } = req.params;
  const orderDetailResults = await orderService.getOrderDetail(orderId);
  res.status(StatusCodes.OK).json(orderDetailResults);
};

module.exports = {
  postOrder,
  getOrders,
  getOrderDetail,
};
