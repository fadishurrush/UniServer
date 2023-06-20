const { default: mongoose } = require("mongoose");
const mongodb = require("mongodb");
const UserModule = require("../modules/UserModule");

module.exports = {
  Login: async (req, res) => {
    console.log("Login requested");
    try {
      // Get user input
      const { UserName, Phone } = req.body;
      // Validate user input
      if (!(UserName && Phone)) {
        res.status(400).send("All input are required");
      }
      // Validate if user exist in our database
      const user = await UserModule.findOne({ Phone });

      if (user) {
        return res.status(200).json({
          user: user,
        });
      } else {
        const user = await UserModule.create({
          UserName: UserName.toLowerCase(),
          Phone: Phone,
          _id: new mongoose.Types.ObjectId(),
        });
        user
          .save()
          .then(() => {
            res.status(200).json({ message: "User Created", user: user });
          })
          .catch((e) => {
            res.status(400).json({ message: "error type:" + e });
          });
      }
    } catch (err) {
      console.log(err);
    }
  },
  AddQuestion: async (req, res) => {
    console.log("AddQuestion requested");

    try {
      // Get user input
      const { Phone, Question } = req.body;
      // Validate user input
      if (!Phone) {
        res.status(403).json({
          message: "userPhone empty",
        });
      } else {
        const Users = await UserModule.find({ Phone });
        const user = Users[0];
        //checks if user exists in database
        if (!user) {
          res.status(402).json({
            message: "there is no such user",
          });
        } else {
          user.AnsweredQuestions.push(Question);
          await UserModule.updateOne(
            { _id: user._id },
            {
              $set: {
                AnsweredQuestions: [...user.AnsweredQuestions],
              },
            }
          )
            .then(() => {
              return res.status(200).json({ message: "question saved!" });
            })
            .catch((e) => {
              console.log("update question error :", e);
            });
        }
      }
    } catch (e) {
      console.log("error :", e);
    }
  },
  getHigh20: async (req, res) => {
    console.log("getHigh20 requested");

    const Users = await UserModule.find();
    console.log("users", Users);
    const FinalScores = [];
    
    Users.forEach((user) => {
      user.isFinished ?
      FinalScores.push({
        userScore: user.FinalScore,
        userTime: user.FinishTime,
        username: user.UserName,
      }) : null ;
    });
    FinalScores.sort((a, b) => {
      if (b.userScore - a.userScore == 0) {
        return b.userTime - a.userTime;
      } else {
        return b.userScore - a.userScore;
      }
    });
    while (FinalScores.length > 20) {
      FinalScores.pop();
    }
    console.log("final scores arr : ", FinalScores);
    res.status(200).json({
      finalscores: FinalScores,
    });
  },
  getUsers: async (req, res) => {
    console.log("getUsers requested");

    const Users = await UserModule.find();
    const FinalScores = [];
    Users.forEach((user) => {
      user.isFinished ?
      FinalScores.push({
        userScore: user.FinalScore,
        username: user.UserName,
      }) : null 
    });
    // sorts from highest to lowest
    FinalScores.sort((a, b) => {
      return b.userScore - a.userScore;
    });
    res.status(200).json({
      finalscores: FinalScores,
    });
  },
  isFinished: async (req, res) => {
    try {
      console.log("isFinished requested");
      const { Phone } = req.body;
      if (!Phone) {
        return res.status(203).json({
          message: "Phone number is required",
        });
      } else {
        const users = await UserModule.find({ Phone: Phone });
        const user = users[0];
        if (!user.isFinished) {
          const time = new Date();
          await UserModule.updateOne(
            { _id: user._id },
            {
              $set: {
                FinishTime: time,
                isFinished: true,
              },
            }
          )
            .then(() => {
              return res.status(200).json({
                message: "user finished",
              });
            })
            .catch((e) => {
              console.log("user is finished update error ", e);
            });
        } else {
          return res.status(200).json({
            message: user.UserName + " already finished",
          });
        }
      }
    } catch (error) {
      console.log("is finished error", error);
    }
  },
  getAnsweredQuestions: async (req, res) => {
    const Phone = req.query?.Phone;
    console.log("getAnsweredQuestions requested");
    if (!Phone) {
      return res.status(408).json({
        message: "phone number is required",
      });
    } else {
      await UserModule.find({ Phone: Phone })
        .then((users) => {
          if (users[0]) {
            return res.status(200).json({
              AnsweredQuestions: users[0]?.AnsweredQuestions,
            });
          } else {
            return res.status(407).json({
              message: "no user exists",
            });
          }
        })
        .catch((e) => {
          console.log("get AnsweredQuestions error", e);
        });
    }
  },
  getCorrectAnsweres: async (req, res) => {
    console.log("getCorrectAnsweres requested");
    const Phone = req.query?.Phone;
    console.log("getAnsweredQuestions requested");
    if (!Phone) {
      return res.status(408).json({
        message: "phone number is required",
      });
    } else {
      await UserModule.find({ Phone: Phone })
        .then((users) => {
          if (users[0]) {
            console.log("user", users[0].FinalScore);
            return res.status(200).json({
              Counter: users[0]?.FinalScore,
            });
          } else {
            return res.status(407).json({
              message: "no user exists",
            });
          }
        })
        .catch((e) => {
          console.log("get Correct Answeres error", e);
        });
    }
  },
  addCorrectAnswer: async (req, res) => {
    console.log("addCorrectAnswer requested");

    const { Phone } = req.body;
    console.log("addCorrectAnswer requested");
    if (!Phone) {
      return res.status(408).json({
        message: "phone number is required",
      });
    }

    await UserModule.find({ Phone: Phone })
      .then((users) => {
        if (users[0]) {
          UserModule.updateOne(
            { _id: users[0]._id },
            {
              $set: {
                FinalScore: users[0].FinalScore + 1,
              },
            }
          )
            .then(() => {
              return res.status(200).json({
                message: "score updated",
              });
            })
            .catch((e) => {
              console.log("update score error", e);
            });
        } else {
          return res.status(407).json({
            message: "no user exists",
          });
        }
      })
      .catch((e) => {
        console.log("get Correct Answeres error", e);
      });
  },
  get19june:async (req,res)=>{
    try {
      const finalUsers=[];
      const Users = await UserModule.find();
    Users.forEach((user) => {
      var time = new Date(user?.FinishTime) 
        time?.getDate() == 19 ?
        finalUsers.push(user) : null 
    })
    finalUsers.length>0 ?
    res.status(200).json({Users:finalUsers}) :
    res.status(200).json({message:"there is no users in 19 june"})


    } catch (error) {
      console.log("get19june error :" ,error);
    }
    
  },
  get20june:async (req,res)=>{
    try {
      const finalUsers=[];
      const Users = await UserModule.find();
    Users.forEach((user) => {
      var time = new Date(user?.FinishTime) 
        time?.getDate() == 20 ?
        finalUsers.push(user) : null 
    })
    finalUsers.length>0 ?
    res.status(200).json({Users:finalUsers}) :
    res.status(200).json({message:"there is no users in 19 june"})


    } catch (error) {
      console.log("get19june error :" ,error);
    }
    
  }
};
