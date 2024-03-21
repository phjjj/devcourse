const express = require("express");
const app = express();
app.listen(1234);
app.use(express.json());

const db = new Map();

const youtuber = {
  channelTitle: "해준",
  sub: "10만명",
  videoNum: "12개",
};
const youtuber2 = {
  channelTitle: "철수",
  sub: "130만명",
  videoNum: "122개",
};
const youtuber3 = {
  channelTitle: "영희",
  sub: "110만명",
  videoNum: "152개",
};
let id = 1;
db.set(id++, youtuber);
db.set(id++, youtuber2);
db.set(id++, youtuber3);

app.get(`/youtubers`, (req, res) => {
  let youtubers = {};
  db.forEach((youtuber, key) => (youtubers[key] = youtuber));

  res.json(youtubers);
});
app.get(`/youtubers/:id`, function (req, res) {
  let { id } = req.params;
  id = parseInt(id);

  const youtuber = db.get(id);
  if (youtuber == undefined) {
    res.json({
      message: "유튜버를 찾을 수 없습니다",
    });
  } else {
    res.json(youtuber);
  }
});

app.post(`/youtubers`, (req, res) => {
  db.set(id++, req.body);

  res.json({
    message: db.get(id - 1).channelTitle + "님 유튜버 생활을 응원합니다.",
  });
});

app.delete(`/youtubers/:id`, (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  if (!db.has(id)) {
    res.json("아이디가 없다");
  }

  const channelTitle = db.get(id).channelTitle;
  db.delete(id);

  res.json(`${channelTitle}님 바이바이`);
});

app.delete(`/youtubers`, (req, res) => {
  if (db.size == 0) {
    res.json("삭제할 유튜버가 없노");
  }
  db.clear();
  res.json("전체 유튜버 삭제");
});

app.put(`/youtubers/:id`, (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  if (!db.has(id)) {
    res.json("아이디가 없다");
  }
  let youtuber = db.get(id);
  let oldTitle = youtuber.channelTitle;
  youtuber.channelTitle = req.body.channelTitle;
  youtuber.sub = req.body.sub;
  youtuber.videoNum = req.body.videoNum;

  res.json(`${oldTitle}에서 ${youtuber.channelTitle}로 바뀜`);
});
