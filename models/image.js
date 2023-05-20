const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
  originalname: String,
  mimetype: String,
  filename: String,
  path: String,
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
