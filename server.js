const express = require("express");
const cors = require("cors");
const db = require("./models/db");
const api = require("./routers/api/main");

const app = express();
app.use(express.json());
app.use(cors());

// create all tables
(async () => {
  await db.create.user();
  await db.create.book();
  await db.create.userBook();
  await db.create.logger();
})();

app.get("/", (req, res) => {
  res.redirect("/api");
});

app.use("/api", api);

app.use("*", (req,res)=>{
  res.status(404).send("Method do not allowed")
});


const PORT = 3005;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
