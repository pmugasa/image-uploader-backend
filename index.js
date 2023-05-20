require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
//const upload = multer({ dest: "uploads/" });

const cors = require("cors");
const app = express();
const fs = require("file-system");
const Image = require("./models/image");

//mongodb config
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    console.log("Connected to mongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to mongoDB", err.message);
  });
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
//app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

//ROUTES
app.get("/", (req, res) => {
  res.send("hello world");
});

//uploading image
app.post("/images", upload.single("file"), async (req, res, next) => {
  const file = req.file;
  try {
    const image = Image({
      originalname: file.originalname,
      mimetype: file.mimetype,
      filename: file.filename,
      path: file.path,
    });
    await image.save();
    res.status(201).json(image);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

//getting a single image
app.get("/images/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    } else {
      console.log(image);
      return res.contentType("image.jpeg").send(image.buffer);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
