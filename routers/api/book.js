const db = require("../../models/db");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const books = await db.read.books();
    console.log(books);
    if (books.length === 0) {
      res.status(400).json({ messduration: "User data is not exist yet" });
      return;
    }
    res.json(books);
  } catch (error) {
    res.json({ error });
  }
});

router.get("/:bookId", async (req, res) => {
  try {
    const book = await db.read.bookById(req.params.bookId);
    if (book.length === 0) {
      res.status(400).json({ messduration: "Book is not exist" });
      return;
    }
    console.log(book);
    res.json(book);
  } catch (error) {
    res.json({ error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, count, duration } = req.body;
    if (!name || !count || !duration) {
      res
        .status(404)
        .json({ error: "name, count and duration must be required" });
      return;
    }
      const nameExist = (await db.read.bookByName(name)).length > 0;
      if (nameExist) {
        res
          .status(400)
          .json({ error: "The book with this name already exist" });
        return;
      }
      await db.insert.book(name, count, duration);
      res.status(200).json(...(await db.read.bookByName(name)));
    
      // res.json();
    } catch (error) {
    res.status(404).json({ error });
  }
});

router.put("/:bookId", async (req, res) => {
  try {
    const bookId = req.params.bookId;
    let book = await db.read.bookById(bookId);
    if (book.length === 0) {
      res.status(400).json({ error: "Book Not Exist" });
      return;
    }
    let { name, count, duration: duration } = req.body;
    const nameExist = (await db.read.bookByName(name)).length > 0;
    if (nameExist) {
      res.status(400).json({ error: "The book with this name already exist" });
      return;
    }
    console.log(book);
    if (!name) name = book[0]["name"];
    if (!count) count = book[0]["count"];
    if (!duration) duration = book[0]["duration"];
    await db.update.book(bookId,name, count, duration);
    res.json({ id: book[0].id, name, count, duration });
  } catch (error) {
    res.json({ error });
  }
});

router.delete("/:bookId", async (req, res) => {
  try {
    const bookId = req.params.bookId;
    let book = await db.read.bookById(bookId);
    if (book.length === 0) {
      res.status(400).json({ error: "Book Not Exist" });
      return;
    }
    db.delete.book(bookId);
    res.json(book);
  } catch (error) {
    res.json({ error });
  }
});

module.exports = router;
