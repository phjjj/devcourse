const { StatusCodes } = require("http-status-codes");
const booksService = require("../services/bookService");

// 전체 도서 조회
const getAllBooks = async (req, res) => {
  const { category_id, news, limit, currentPage } = req.query;
  // console.log(category_id, news, limit, currentPage);
  try {
    const { books, totalCount } = await booksService.getAllBooks(category_id, news, limit, currentPage);

    if (books.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "비어있음" });
    }

    const pagination = {
      currentPage: parseInt(currentPage),
      totalCount,
    };
    // console.log(pagination);
    res.status(StatusCodes.OK).json({ books, pagination });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// 도서 상세 조회
// 로그인 시 좋아요 여부 따로
// 로그인 여부를 어떻게 확인할 것인가?
// 1. 토큰이 없을 때 => 로그인을 하지 않은 상태
// 2. 토큰이 있을 때 => 로그인을 한 상태
const getBookDetail = async (req, res) => {
  const { id: book_id } = req.params;
  try {
    const token = req.headers.authorization;
    const book = await booksService.getBookDetail(book_id, token);
    return res.status(StatusCodes.OK).json(book);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// 카테고리별 도서 조회
const getBooksByCategory = async (req, res) => {
  try {
    const { category_id } = req.query;
    const books = await booksService.getBooksByCategory(category_id);
    return res.status(StatusCodes.OK).json(books);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

module.exports = { getAllBooks, getBookDetail, getBooksByCategory };
