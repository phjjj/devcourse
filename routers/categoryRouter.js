const express = require("express");
const { allCategory } = require("../controllers/categoryController");
const categoryRouter = express.Router();

categoryRouter.get("/", allCategory);

module.exports = categoryRouter;
