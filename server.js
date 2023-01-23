const express = require("express");
const fs = require("fs");
const path = require("path");
var bodyParser = require("body-parser");
var app = express();
app.use(express.static("src"));
app.use(bodyParser.json());

app.listen(10000, function () {
  console.log("Server avviato sulla porta: %d", 10000);
});

//get task from db
app.get("/getTasks", (req, res) => {
  const data = JSON.parse(fs.readFileSync("db.json"));
  res.json(data);
});

app.get("/getTask/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync("db.json"));
  let task = data.tasks.find((task) => task.id == req.params.id);
  res.json(task);
});
// add a task
app.post("/setTask", (req, res) => {
  const data = JSON.parse(fs.readFileSync("db.json"));
  data.tasks[data.tasks.length] = req.body.newPost;
  fs.writeFileSync("db.json", JSON.stringify(data));
  res.status(200).json({ msg: "item saved" });
});

app.delete("/deleteTask/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync("db.json"));
  let taskIndex = data.tasks.findIndex((task) => task.id == req.params.id);
  data.tasks.splice(taskIndex, 1);
  fs.writeFileSync("db.json", JSON.stringify(data));
  res.json(data);
  //res.status(200).json({ msg: "item delete" });
});

app.put("/update/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync("db.json"));
  const taskId = req.params.id;
  const newTaskData = req.body.newPost;
  let taskIndex = data.tasks.findIndex((task) => task.id == req.params.id);
  data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...newTaskData };
  fs.writeFileSync("db.json", JSON.stringify(data));
  res.status(200).json({ msg: "item saved" });
});
