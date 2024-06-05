// 박해준
const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const verify = require("../auth");
const cartService = require("../services/cartService");
const jwtUtil = require("../utils/jwtUtil");
// 장바구니 불러오기
const getCart = async (req, res) => {
  const { selected } = req.body;
  const token = req.headers.authorization;
  const user = jwtUtil.decodeToken(token);

  try {
    const results = await cartService.getCart(user.id, selected);
    return res.status(StatusCodes.OK).json(results);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// 장바구니 담기
const postAddCart = async (req, res) => {
  const { book_id, quantity } = req.body;
  try {
    const token = req.headers.authorization;
    const user = jwtUtil.decodeToken(token);

    const results = await cartService.addCart(book_id, quantity, user.id);
    return res.status(StatusCodes.OK).json(results);
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
  }
};

// 장바구니 삭제하기
const deleteRemovecCart = (req, res) => {
  const { id } = req.params;
  try {
    const results = cartService.removeCart(id);
    return res.status(StatusCodes.OK).json(results);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

module.exports = { postAddCart, getCart, deleteRemovecCart };
