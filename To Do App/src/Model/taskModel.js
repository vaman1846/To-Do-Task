const mongoose = require("mongoose");

const model = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: Date },
  description: { type: String, required: false },
  createdOn: { type: Date, required: true },
  startTime: { type: Date, required: false },
  endTime: { type: Date, required: false },
  isCompleted: { type: Boolean, required: false, default: false },
});

module.exports = mongoose.model("schema", model);
