const express = require("express");
const app = express();
app.listen(1234);
let db = new Map();
var id = 1;
// 로그인
app.use(express.json());
app.post(`/login`, (req, res) => {});
// 회원가입
app.post(`/join`, (req, res) => {
  const { userId, password, name } = req.body;
  if (userId && password && name) {
    db.set(id++, req.body);
    res.status(201).json(`${name}` + "님 가입을 축하합니다");
  } else {
    res.status(400).json({ message: "입력 똑바로하세요" });
  }
});

// 회원 개별 조회
app
  .route(`/users/:id`)
  .get((req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    const findUser = db.get(id);
    if (findUser) {
      res.status(200).json(findUser);
    } else {
      res.status(404).json({ message: "그런사람없다" });
    }
  })
  .delete((req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    const deleteUser = db.get(id);
    if (deleteUser) {
      db.delete(id);
      res.status(200).json(`${deleteUser.name}  님 잘가요`);
    } else {
      res.status(404).json({ message: "그런사람없다" });
    }
  });

// 회원 전체 조회
app.get(`/users`, (req, res) => {});
