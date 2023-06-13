const mongoose = require('mongoose')

const UserModule =mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    UserName: {type:String , required:true },
    Phone :{type:String , required:true , unique:true},
    AnsweredQuestions :{type:[]},
    FinalScore:{type: Number, default: 0},
    FinishTime:{type: Date},
    isFinished:{type: Boolean, default:false},
})

module.exports= mongoose.model('User' , UserModule)