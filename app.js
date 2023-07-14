//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require("mongoose");
// const router=express.Router();
require("dotenv").config();

console.log(process.env.PORT);
const app = express();

app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGODB_VAR);

// const connectDB=async()=>{
//   try{
//     await mongoose.connect(process.env.MONGODB_VAR)
//     console.log("Connect to mongodb successful");
//   }
//   catch(error){
//     console.log("Connect failed"+error.message)
//   }
// }

const TodoSchema=new mongoose.Schema({
  Title:String
});

const Layout=mongoose.model("Layout",TodoSchema);

const input1=new Layout({
  Title:" Welcome to your TodoList "
});
const input2=new Layout({
  Title:"+ Click here to add to the list"
});
const input3=new Layout({
  Title:"<-- Click here to delete from the list"
});

var inputList=[input1,input2,input3];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));

//const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.get("/", function(req, res) {

console.log(__dirname);
const day = date.getDate();

Layout.find({}).then((data)=>{
       console.log(data);
       if(data.length===0)
       {
         Layout.insertMany(inputList).then((err,data)=>{
           if(err)
             console.log(err);
           else {
             console.log("Layout inserted successfully");
           }
         });
       }
       res.render("list", {listTitle: day, newListItems: data});
    }).catch((err)=>{
      console.log(err);
    });
    //res.render("list", {listTitle: "Today", newListItems: data});
});


app.post("/", function(req, res){

   inputList.push(req.body.newItem);

   const inputPost=new Layout({
     Title:req.body.newItem
   });

   inputPost.save();

   res.redirect("/");

  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});

app.post("/delete",function(req,res){
  const { checkbox } = req.body
    console.log(checkbox);
  Layout.deleteOne({Title:checkbox}).then((data)=>{
    console.log("Deleted "+data);
  });
  res.redirect("/")
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

// app.use("/.netlify/functions/api",router);
// module.exports.handler=serverless(app);
// "test": "echo \"Error: no test specified\" && exit 1"

app.listen(process.env.PORT, function() {
  console.log(process.env.PORT);
});
// module.exports=connectDB;
