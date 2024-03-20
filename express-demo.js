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
  res.json({ message: "hi" });
});
app.get(`/youtuber/:id`, function (req, res) {
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
app.post(`/youtuber`, (req, res) => {
  db.set(id++, req.body);

  res.json({
    message: db.get(id - 1).channelTitle + "님 유튜버 생활을 응원합니다.",
  });
});
