const mongoose=require("mongoose");
const Schema= mongoose.Schema;
 const IdeaSchema= new Schema({
     title:{
         type:String,
         required:true

     },
     details:{
         type:String,
         required:true
     },
     user:{
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

mongoose.model('ideas', IdeaSchema);
