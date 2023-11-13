const db = require("../../models/db");
const express = require("express");
const router = express.Router();
const user = require('./user')
const book = require('./book')
const userBook = require('./userBook')

router.use('/user',user)
router.use('/book',book)
router.use('/user-book',userBook)
module.exports = router