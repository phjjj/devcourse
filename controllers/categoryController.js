// 박해준
const { body, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const pool = require("../mariadb");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv").config();

const allCategory = async (req, res) => {
  const sql = "SELECT * FROM category";
  const [result] = await pool.query(sql);
  res.status(StatusCodes.OK).json(result);
};

module.exports = { allCategory };
