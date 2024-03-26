const express = require("express");
const router = express.Router();

router.use(express.json());

let db = new Map();
var id = 1;

router
  .route("/")
  .get((req, res) => {
    let { userId } = req.body;
    let channels = [];

    if (db.size && userId) {
      db.forEach((v, i) => {
        // db안에 객체의 v의 userId키 값이 같을 경우
        if (v.userId === userId) {
          channels.push(v);
        }
      });

      if (channels.length) {
        res.status(200).json(channels);
      } else {
        notFoundChannel();
      }
    } else {
      notFoundChannel(res);
    }
  })

  .post((req, res) => {
    if (req.body.channelTitle) {
      let channel = req.body;

      db.set(id++, channel);

      res.status(201).json({ message: `${db.get(id - 1).channelTitle} 채널을 응원합니다` });
    } else {
      notFoundChannel();
    }
  });

router
  .route("/:id")
  .get((req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    let channel = db.get(id);

    if (channel) {
      res.status(200).json(channel);
    } else {
      notFoundChannel();
    }
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
      notFoundChannel();
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
      notFoundChannel();
    }
  });

function notFoundChannel(res) {
  res.status(404).json({
    message: "채널 정보를 찾을 수 없습니다.",
  });
}
module.exports = router;
