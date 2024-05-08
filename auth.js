const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");

const verify = (req, res) => {
  try {
    let receivedjwt = req.headers["authorization"];

    if (receivedjwt) {
      let decodedJwt = jwt.verify(receivedjwt, process.env.PRIVATE_KEY);
      return decodedJwt;
    } else {
      throw new ReferenceError("jwt가 필요하다");
    }
  } catch (err) {
    console.log(err.name);
    console.log(err.message);

    return err;
  }
};

module.exports = verify;
