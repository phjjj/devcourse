const cartModel = require("../models/cartModel");
// 장바구니 불러오기 service
const getCart = async (userId, selected) => {
  try {
    const results = await cartModel.findCart(userId, selected);
    return results;
  } catch (err) {
    throw new Error(err.message);
  }
};

// 장바구니 담기 service
const addCart = async (book_id, quantity, userId) => {
  try {
    const results = await cartModel.addCart(book_id, quantity, userId);
    return results;
  } catch (err) {
    throw new Error(err.message);
  }
};

// 장바구니 삭제하기 service
const removeCart = async (cartItemsId) => {
  try {
    const results = await cartModel.removeCart(cartItemsId);
    return results;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { getCart, addCart, removeCart };
