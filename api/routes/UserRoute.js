const express = require("express");
const { Login, AddQuestion, getHigh20, isFinished, getAnsweredQuestions, getCorrectAnsweres, addCorrectAnswer, getUsers, get19june, get20june } = require("../controller/UserController");
const UserRoute = express.Router();


UserRoute.get("/getHigh20", getHigh20);
UserRoute.get("/get19june", get19june);
UserRoute.get("/get20june", get20june);
UserRoute.get("/getUsers", getUsers);
UserRoute.get("/getAnsweredQuestions", getAnsweredQuestions);
UserRoute.get("/getCorrectAnsweres", getCorrectAnsweres);
UserRoute.post("/Login", Login);
UserRoute.patch("/AddQuestion",AddQuestion );
UserRoute.patch("/AddCorrectAnswer",addCorrectAnswer );
UserRoute.patch("/isFinished",isFinished );

module.exports = UserRoute;