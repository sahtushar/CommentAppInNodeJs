const mongoose=require("mongoose");
const Schema= mongoose.Schema;
const CommentSchema= new Schema({
    text:{
        type:String,
        required:true

    },
    user:{
        type:String,
        required:true
    },
    idea:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    name:{
        type:String,
        required:false
    },
})

mongoose.model('comment', CommentSchema);
