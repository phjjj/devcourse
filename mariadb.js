const mariadb = require("mysql2/promise");

// 데이터베이스 풀 생성
const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Bookshop",
  dateStrings: true,
  connectionLimit: 10, // 최대 연결 개수 설정
});

console.log("Connected to MariaDB!");

// 데이터베이스 풀을 모듈로 내보내기
module.exports = pool;
