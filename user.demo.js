const express = require("express");
const app = express();
app.listen(1234);
let db = new Map();
var id = 1;
// 로그인
app.use(express.json());

app.post(`/login`, (req, res) => {
  const { userId, password } = req.body;

  let loginUser = {};

  db.forEach((user, id) => {
    if (user.userId === userId) {
      loginUser = user;
    }
  });

  if (isExist(loginUser)) {
    console.log("아이디를 찾았다");
  } else {
    if (loginUser.password === password) {
      console.log("패스워드도 같다");
    } else {
      console.log("패스워드는 틀렸다.");
    }
  }
});
function isExist(obj) {
  if (Object.keys(obj).length) {
    return true;
  } else {
    return fa;
  }
}
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
