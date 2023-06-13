const express = require("express");
const App = express();
const mongoose = require("mongoose");
const UserRoute = require("./api/routes/UserRoute")
mongoose.connect(
  "mongodb+srv://Fadishurrush:krkIQCsSxTLXxA9Z@cluster0.ybiycvx.mongodb.net/?retryWrites=true&w=majority"
);

mongoose.connection.on("connected", () => {
  console.log("mongo conected");
});
App.use(express.json());
App.use("/", UserRoute);
module.exports = App;
