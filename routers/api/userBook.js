const db = require("../../models/db");
const express = require("express");
const router = express.Router();

// utility
Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

router.get("/", async (req, res) => {
  try {
    const userBooks = await db.read.userBooks();
    if (userBooks.length === 0) {
      res.status(400).json({ error: "UserBook data is not exist yet" });
      return;
    }
    res.json(userBooks);
  } catch (error) {
    res.json({ error });
  }
});

router.get("/:userId", async (req, res) => {
  try {
  } catch (error) {
    res.json({ error });
  }
  const userBook = await db.read.userBookByUserId(req.params.userId);
  if (userBook.length === 0) {
    res.status(400).json({ message: "User is not exist" });
    return;
  }
  console.log(userBook);
  res.json(userBook);
});

router.get("/:booId", async (req, res) => {
  try {
  } catch (error) {
    res.json({ error });
  }
  const userBook = await db.read.userBookByBookId(req.params.booId);
  if (userBook.length === 0) {
    res.status(400).json({ message: "User is not exist" });
    return;
  }
  console.log(userBook);
  res.json(userBook);
});

router.post("/", async (req, res) => {
  const { userId, bookId } = req.body;
  if (!userId || !bookId) {
    res.status(404).json({ error: "userId and bookId must be required" });
    return;
  }
  try {
    console.log(true);
    const isUserExist = (await db.read.userById(userId)).length > 0;
    console.log(true, 1);
    const isBookExist = (await db.read.bookById(bookId)).length > 0;
    console.log(true, 2);
    if (!isUserExist) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    console.log(isBookExist, isUserExist);
    if (!isBookExist) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    const isDataExist =
      (await db.read.userBookByUserIdBookId(userId, bookId)).length > 0;
    console.log(isDataExist, 3);
    const book = await db.read.bookById(userId);
    if (isDataExist) {
      res.status(400).json({ error: "This Data already exist" });
      return;
    }
    const date = new Date();
    const currentDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
    console.log(currentDate);
    const startDate = `${currentDate.year}-${
      currentDate.month < 9 ? "0" + currentDate.month : currentDate.month
    }-${currentDate.day < 9 ? "0" + currentDate.day : currentDate.day}`;
    const date2 = new Date().addDays(book[0].duration);
    const lastDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
    console.log(lastDate);
    const endDate = `${lastDate.year}-${
      lastDate.month < 9 ? "0" + lastDate.month : lastDate.month
    }-${lastDate.day < 9 ? "0" + lastDate.day : lastDate.day}`;
    db.insert.userBook(userId, bookId, startDate, endDate);
    res
      .status(200)
      .json(...(await db.read.userBookByUserIdBookId(userId, bookId)));
  } catch (error) {
    res.status(404).json({ error });
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    let user = await db.read.userById(userId);
    if (user.length === 0) {
      res.status(400).json({ error: "User Not Exist" });
      return;
    }
    let { full_name, username, age } = req.body;
    const isUsernameExist = (await db.read.userByUsername(username)).length > 0;
    if (isUsernameExist) {
      res.status(400).json({ error: "This username already exist" });
      return;
    }
    if (full_name) full_name = full_name;
    else full_name = user[0]["full_name"];
    if (username) username = username;
    else username = user[0]["username"];
    if (age) age = age;
    else age = user[0]["age"];
    await db.update.user(userId, full_name, username, age);
    res.json({ id: user[0].id, full_name, username, age });
  } catch (error) {
    res.json({ error });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    let user = await db.read.userById(userId);
    if (user.length === 0) {
      res.status(400).json({ error: "User Not Exist" });
      return;
    }
    db.delete.user(userId);
    res.json(user);
  } catch (error) {
    res.json({ error });
  }
});

module.exports = router;
