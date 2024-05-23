const express = require("express");
const { postAddCart, getCart, deleteRemovecCart } = require("../controllers/cartController");
const cartRouter = express.Router();

cartRouter.route("/").post(postAddCart).get(getCart);
cartRouter.delete("/:id", deleteRemovecCart);

module.exports = cartRouter;
