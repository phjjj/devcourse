const pool = require("../mariadb");
// 유저 등록
const createUser = async (email, password, salt) => {
  try {
    const createUserQuery = "INSERT INTO users (email, password, salt) VALUES (?, ?, ?)";
    const values = [email, password, salt];
    const result = await pool.query(createUserQuery, values);
    return result;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("이미 존재하는 이메일입니다.");
    }

    console.error("회원가입 에러:", error);
    throw new Error("회원가입 중 에러 발생");
  }
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

module.exports = { createUser, findUserByEmail };
