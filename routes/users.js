const express = require("express");
const router = express.Router();

// 로그인
router.use(express.json());

let db = new Map();
var id = 1;

router.post(`/login`, (req, res) => {
  const { userId, password } = req.body;

  let loginUser = {};

  db.forEach((user, id) => {
    if (user.userId === userId) {
      loginUser = user;
    }
  });

  if (isExist(loginUser)) {
    if (loginUser.password === password) {
      res.status(200).json({
        message: `${loginUser.name} 님 로그인 되었습니다.`,
      });
    } else {
      res.status(400).json({
        message: "비밀번호가 틀렸습니다.",
      });
    }
  } else {
    console.log("없는 아이디입니다.");
  }
});
function isExist(obj) {
  if (Object.keys(obj).length) {
    return true;
  } else {
    return false;
  }
}
// 회원가입
router.post(`/join`, (req, res) => {
  const { userId, password, name } = req.body;
  if (userId && password && name) {
    db.set(userId, req.body);
    res.status(201).json(`${name}` + "님 가입을 축하합니다");
  } else {
    res.status(400).json({ message: "입력 똑바로하세요" });
  }
});

// 회원 개별 조회
router
  .route(`/users`)
  .get((req, res) => {
    let { userId } = req.body;
    const findUser = db.get(userId);
    if (findUser) {
      res.status(200).json({
        userId: findUser.userId,
        name: findUser.userId,
      });
    } else {
      res.status(404).json({ message: "그런사람없다" });
    }
  })
  .delete((req, res) => {
    let { id } = req.body;
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
router.get(`/users`, (req, res) => {});

module.exports = router;
