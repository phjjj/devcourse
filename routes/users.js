const express = require("express");
const router = express.Router();
const conn = require("../mariadb");

// 로그인
router.use(express.json());

router.post(`/login`, (req, res) => {
  const { email, password } = req.body;

  let sql = `SELECT * FROM users WHERE email = ?`;

  conn.query(sql, email, (err, results) => {
    let loginUser = results[0];
    if (loginUser && loginUser.password === password) {
      res.status(200).json({
        message: `${loginUser.name} 님 로그인 되었습니다.`,
      });
    } else {
      res.status(404).json({
        message: "이메일 또는 비밀번호가 틀렸습니다.",
      });
    }
  });
});

// 회원가입
router.post(`/join`, (req, res) => {
  const { email, name, password, contact } = req.body;
  let sql = `INSERT INTO users (email, name, password, contact) VALUES (?, ?, ?, ?)`;
  let values = [email, name, password, contact];
  if (email && name && password && contact) {
    conn.query(sql, values, (err, results, fields) => {
      res.status(200).json(results);
      // res.status(201).json(`${name}` + "님 가입을 축하합니다");
    });
  } else {
    res.status(400).json({ message: "입력 똑바로하세요" });
  }
});

// 회원 개별 조회
router
  .route(`/users`)
  .get((req, res) => {
    let { email } = req.body; // 근데 아이디로 하면 안되나??
    let sql = `SELECT * FROM users WHERE email = ?`;
    conn.query(sql, email, function (err, results, fields) {
      if (results.length) {
        res.status(200).json(results);
      } else {
        res.status(404).json({
          message: "회원 정보가 없습니다.",
        });
      }
    });
  })
  .delete((req, res) => {
    let { email } = req.body; // 근데 아이디로 하면 안되나??
    let sql = `DELETE FROM users WHERE email = ?`;
    conn.query(sql, email, function (err, results, fields) {
      res.status(200).json(results);
    });
  });

module.exports = router;
