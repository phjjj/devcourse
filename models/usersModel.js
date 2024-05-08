const pool = require("../mariadb");
// 회원가입
const createUser = async (email, password, salt) => {
  const createUsersql = "INSERT INTO users (email, password, salt) VALUES (?, ?, ?)";
  const values = [email, password, salt];
  const result = await pool.query(createUsersql, values);
  if (result[0].affectedRows > 0) {
    return true;
  }
};

module.exports = { createUser };
