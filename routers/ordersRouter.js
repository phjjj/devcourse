const express = require("express");
const { getOrderDetail, getOrders, postOrder } = require("../controllers/orderController");
const ordersRotuer = express.Router();

ordersRotuer.route("/").get(getOrders).post(postOrder);
ordersRotuer.get("/:id", getOrderDetail);

module.exports = ordersRotuer;
