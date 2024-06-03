const express = require("express");
const { getAllBooks, getBookDetail, getBooksByCategory } = require("../controllers/bookController");
const bookRouter = express.Router();

bookRouter.route("/").get(getAllBooks).get(getBooksByCategory);
bookRouter.get("/:id", getBookDetail);
// bookRouter.get("/:id/likes");
// bookRouter.put("/:id/likes");

module.exports = bookRouter;
