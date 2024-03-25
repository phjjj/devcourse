const express = require("express");
const app = express();
app.listen(7777);
app.use(express.json());

let db = new Map();
var id = 1;

app
  .route("/channels")
  .get((req, res) => {
    if (db.size) {
      let channels = [];
      db.forEach((v) => {
        channels.push(v);
      });

      res.json(channels);
    } else {
      res.json({ message: "현재 존재하는 채널이 없습니다" });
    }
  })
  .post((req, res) => {
    if (req.body.channelTitle) {
      db.set(id++, req.body);

      res.status(201).json({ message: `${db.get(id - 1).channelTitle} 채널을 응원합니다` });
    } else {
      res.status(400).json({ message: "요청 값을 잘못입력했어요" });
    }
  });

app
  .route("/channels/:id")
  .get((req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    let channel = db.get(id);

    if (channel) {
      res.status(200).json(channel);
    } else {
      res.status(404).json({ message: "찾는 아이디가 없어요" });
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
      res.json(404).json({ message: "아이디가 없어요" });
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
      res.json(404).json({ message: "아이디가 없어요" });
    }
  });
