// 박해준
const { body, validationResult } = require('express-validator')
const { StatusCodes } = require('http-status-codes')
const conn = require('../mariadb')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const dotenv = require('dotenv').config()

const allCategory = (req, res) => {
    const sql = 'SELECT * FROM category'
    conn.query(sql, (err, results) => {
        if (err) {
            console.log(err)
            return res.status(StatusCodes.BAD_GATEWAY).end()
        } else {
            return res.status(500).json(results)
        }
    })
}

module.exports = { allCategory }
