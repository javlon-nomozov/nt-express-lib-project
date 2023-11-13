const db = require("../../models/db");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await db.read.users();
    if (users.length === 0) {
      res.status(400).json({ message: "User data is not exist yet" });
      return;
    }
    res.json(users);
  } catch (error) {
    res.json({ error });
  }
});

router.get("/:userId", async (req, res) => {
  try {
  } catch (error) {
    res.json({ error });
  }
  const user = await db.read.userById(req.params.userId);
  if (user.length === 0) {
    res.status(400).json({ message: "User is not exist" });
    return;
  }
  console.log(user);
  res.json(user);
});

router.post("/", async (req, res) => {
  const { full_name, username, age } = req.body;
  if (!full_name || !username || !age) {
    res
      .status(404)
      .json({ error: "full_name, username and age must be required" });
    return;
  }
  try {
    const isUsernameExist = (await db.read.userByUsername(username)).length > 0;
    if (isUsernameExist) {
      res.status(400).json({ error: "This username already exist" });
      return;
    }
    db.insert.user(full_name, username, age);
    res.status(200).json(...(await db.read.userByUsername(username)));
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
    const userBooks = await db.read.userBookByUserId(userId);
    if (userBooks.length === 0) {
      res.status(400).json(userBooks);
      return;
    }
    await db.delete.user(userId);
    res.json(user);
  } catch (error) {
    res.json({ error });
  }
});

module.exports = router;
