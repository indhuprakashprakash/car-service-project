const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dbConfig = require("./config/dbConfig");
const authRoutes = require("./services/authServices");
const carRoutes = require("./services/carServices");
const serviceRoutes = require("./services/car-washServices");
const orderRoutes = require("./services/orderServices");
const mechanicRoutes = require("./services/mechanicServices");

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
app.use("/admin/auth", authRoutes);
app.use("/admin/car-func", carRoutes);
app.use("/admin/car-services", serviceRoutes);
app.use("/admin/order", orderRoutes);
app.use("/admin/mechanic", mechanicRoutes);

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
