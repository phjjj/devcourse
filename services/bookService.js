const bookModel = require("../models/bookModel");

const getAllBooks = async (category_id, news, limit, currentPage) => {
  const offset = limit * (currentPage - 1);
  const books = await bookModel.findAllBooks(category_id, news, limit, offset);

  let totalCount = 0;
  if (currentPage === 1) {
    totalCount = await bookModel.getTotalBookCount(category_id, news);
  }
  return { books, totalCount };
};

const getBookDetail = async (book_id, token) => {
  let book;
  if (token) {
    book = await bookModel.findBookForLoggedInUser(book_id, token);
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
