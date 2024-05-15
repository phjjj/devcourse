const jwt = require("jsonwebtoken");
// 액세스 토큰 생성
const generateAccessToken = (user) => {
  const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.PRIVATE_KEY, {
    expiresIn: "15m",
    issuer: "phj",
  });
  return accessToken;
};

// 리프레시 토큰 생성
const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.PRIVATE_KEY, {
    expiresIn: "7d",
    issuer: "phj",
  });
  return refreshToken;
};

// 토큰 검증
const verifyToken = (token) => {};

// jwt디코딩
const decodeToken = () => {};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
};
