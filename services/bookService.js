const bookModel = require("../models/bookModel");
const jwtUtil = require("../utils/jwtUtil");

const getAllBooks = async (category_id, news, limit, currentPage) => {
  const offset = limit * (currentPage - 1);
  const books = await bookModel.findAllBooks(category_id, news, limit, offset);
  let totalCount = 0;

  totalCount = await bookModel.getTotalBookCount(category_id, news);

  return { books, totalCount };
};

const getBookDetail = async (book_id, token) => {
  let book;
  if (token) {
    const decoded = jwtUtil.decodeToken(token);
    book = await bookModel.findBookForLoggedInUser(book_id, decoded.id);
  } else {
    book = await bookModel.findBookForGuest(book_id);
  }

  if (book) {
    return book;
  }
  return { message: "책이 없습니다." };
};

const getBooksByCategory = async (category_id) => {
  const books = await bookModel.findBooksByCategory(category_id);
  return books;
};

module.exports = { getAllBooks, getBookDetail, getBooksByCategory };
