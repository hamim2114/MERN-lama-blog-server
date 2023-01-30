const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const cors = require('cors');
const path = require("path");

dotenv.config();
mongoose.set("strictQuery", true);

const app = express();

//make images folder public for access to api
app.use("/images", express.static(path.join(__dirname,"/images")))

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    console.log(error);
  }
};

//UPLOAD FILE IN LOCAL
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, res, callback) => {
    callback(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("file uploaded!");
});

//MIDDLEWERE
app.use(express.json());
app.use(cors())

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

mongoose.connection.on("connected", () => {
  console.log("mongoDB connected");
});
mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disConnected");
});

app.listen("5000", () => {
  connect();
  console.log("server running");
});
