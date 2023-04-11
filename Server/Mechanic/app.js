const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dbConfig = require("./config/dbConfig");
const accountRoutes = require("./services/accountServices");
const orderRoutes = require("./services/orderServices");

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

//Database Connection
const databaseUrl = `mongodb+srv://indhuprakashprakash:Indhu@123@indhu.miczmxi.mongodb.net/test`;
mongoose.connect(databaseUrl);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log("Error while connecting to database");
});

database.once("connected", () => {
  console.log("Connected to database successfully");
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//For preventing CORS ERRORS  (Postman is just a testing tool)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//Every request from admin route goes through this url : /admin
app.use("/mechanic/account", accountRoutes);
app.use("/mechanic/orders", orderRoutes);

//Server Side Error Handling
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
