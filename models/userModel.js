const pool = require("../mariadb");
// 유저 등록
const createUser = async (email, password, salt) => {
  const createUserQuery = "INSERT INTO users (email, password, salt) VALUES (?, ?, ?)";
  const values = [email, password, salt];
  const result = await pool.query(createUserQuery, values);
  return result;
};

// 이메일로 유저 찾기
const findUserByEmail = async (email) => {
  const findByUserQuery = "SELECT * FROM users WHERE email = ?";
  const value = [email];
  const result = await pool.query(findByUserQuery, value);
  const [user] = result[0];

  if (user) {
    return user;
  } else {
    throw new Error("사용자를 찾을 수 없습니다.");
  }
};

// 유지 비밀번호 변경
const updatePassword = async (email, newPassword, salt) => {
  const updatePasswordQuery = "UPDATE users SET password = ?, salt = ? WHERE email = ?";
  const value = [newPassword, salt, email];
  const [result] = await pool.query(updatePasswordQuery, value);
  if (result.affectedRows === 0) {
    throw new Error("변경에 실패하였습니다");
  }
  return result;
};

module.exports = { createUser, findUserByEmail, updatePassword };
