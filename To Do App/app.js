const express = require("express");
const mongoose = require("mongoose");
const router = require("./src/Router/taskRouter");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;
const db = mongoose.connect("mongodb://localhost:27017/task-app");
db.then(() => {
  console.log("Db is connected successfully");
});
db.catch(() => {
  console.log(error);
});

app.use("/", router);
app.listen(PORT, () => {
  console.log(`Server is listening in ${PORT}`);
});
