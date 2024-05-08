const express = require("express");
const likesRotuer = express.Router();
const { postAddLike, deleteRemoveLike } = require("../controllers/likesController");
// 좋아요 추가 좋아요 삭제
likesRotuer.route("/:id").post(postAddLike).delete(deleteRemoveLike);

module.exports = likesRotuer;
