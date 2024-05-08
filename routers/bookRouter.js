const express = require("express");
const { getAllBooks, getBook } = require("../controllers/bookController");
const bookRouter = express.Router();

bookRouter.route("/").get(getAllBooks);
bookRouter.get("/:id", getBook);
bookRouter.get("/:id/likes");
bookRouter.put("/:id/likes");

module.exports = bookRouter;

let book = {
  id: "id",
  image: "이미지주소",
  categroy: "카테고리",
  foramt: "포맷",
  isbn: "isbn",
  title: "제목",
  summary: "요약 설명",
  description: "상세 설명",
  pages: "쪽수",
  index: "목차",
  author: "작가",
  price: "가격",
  likes: "좋아요",
  liked: Boolean,
};
