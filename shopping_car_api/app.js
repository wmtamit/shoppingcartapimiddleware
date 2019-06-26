const express = require("express");
const app = express();

const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const productRouter = require("./routes/products");
const orderRouter = require("./routes/orders");
const userRouter= require("./routes/users")
//mongodb atlas

mongoose.connect(
  "mongodb://admin:amit@cluster0-shard-00-00-xoeje.mongodb.net:27017,cluster0-shard-00-01-xoeje.mongodb.net:27017,cluster0-shard-00-02-xoeje.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true",{useNewUrlParser:true});

//mongodb local 


//  mongoose.connect("mongodb://127.0.0.1:27017/shopping",{useNewUrlParser: true })
app.use(morgan("dev"));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE,PATCH,GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/user",userRouter);

app.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      status: error.status,
      message: error.message
    }
  });
});
module.exports = app;
