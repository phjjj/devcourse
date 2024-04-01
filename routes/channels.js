const express = require("express");
const router = express.Router();
const conn = require("../mariadb");
router.use(express.json());
let db = new Map();
var id = 1;

router
  .route("/")
  .get((req, res) => {
    let { userId } = req.body;
    let sql = `SELECT * FROM channels WHERE user_id = ?`;

    // 단축평가 좋긴한데 뭔가 보기 어려움
    if (userId) {
      conn.query(sql, userId, (err, results) => {
        if (results) {
          res.status(200).json(results);
        } else {
          notFoundChannel(res);
        }
      });
    } else {
      res.status(400).end();
    }
  })

  .post((req, res) => {
    const { name, userId } = req.body;
    if (name && userId) {
      let sql = `INSERT INTO channels (name, user_id) VALUES (?, ?)`;
      let values = [name, userId];

      conn.query(sql, values, (err, results) => {
        res.status(201).json(results);
      });
    } else {
      res.status(400).json({ message: "입력 똑바로하세요" });
    }
  });

router
  .route("/:id")
  .get((req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    let sql = `SELECT * FROM channels WHERE id = ?`;
    conn.query(sql, id, function (err, results, fields) {
      if (results.length) {
        res.status(200).json(results);
      } else {
        notFoundChannel(res);
      }
    });
    let channel = db.get(id);
  })
  .put((req, res) => {
    let { id } = req.params;
    let { channelTitle } = req.body;

    id = parseInt(id);
    let channel = db.get(id);
    let oldTitle = channel.channelTitle;

    if (channel) {
      let newTitle = req.body.channelTitle;

      channel.channelTitle = newTitle;
      db.set(id, channel);
      res.status(200).json({ message: `채널명이 ${oldTitle}에서 ${newTitle}로 변경되었습니다.` });
    } else {
      notFoundChannel(res);
    }
  })
  .delete((req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    let channel = db.get(id);

    if (channel) {
      db.delete(id);
      res.status(200).json({ message: "삭제완료" });
    } else {
      notFoundChannel(res);
    }
  });

function notFoundChannel(res) {
  res.status(404).json({
    message: "채널 정보를 찾을 수 없습니다.",
  });
}
module.exports = router;
