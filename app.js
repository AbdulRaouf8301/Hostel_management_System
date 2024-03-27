
const express = require("express");
const mongoose = require("mongoose");
const { start } = require("repl");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { register } = require("module");
const path = require("path");
const app = express();//server method to set port number
app.listen(5000,function(){
    console.log('Server is Running Sucessful')
});//number ex 3000
//to connect mongodb
app.use(bodyParser.urlencoded({
extended:true
}));

const static_path = path.join(__dirname,'public');
app.use(express.static(static_path));

mongoose.connect("mongodb://localhost:27017/hms",{
  useNewUrlParser:true 
}).then(()=>{
    console.log("connection is sucess");
}).catch(()=>{
    console.log("connection is failed");
});


//set server engine
app.set("view engine","ejs");

//set server startup page
app.get("/",(req,res)=>{
    res.render("index");
});
//set server reg
app.get("/register",(req,res)=>{
    res.render("register");
});
//create Model class
const registerSchema = {
    fullname:String,
    email:String,
    password:String
};
const Register = mongoose.model("customer",registerSchema );
//set server post page
app.post("/register",(req,res)=>{
console.log(req.body.fullname);
console.log(req.body.email);
console.log(req.body.password);
//send data to database
const reg=new Register({
    fullname:req.body.fullname,
    email:req.body.email,
    password:req.body.password
});
reg.save().then(()=>{
    console.log("Data stored sucess");
     //Email configuration
   var sentinfo = nodemailer.createTransport({
   service:'gmail',
   auth:{
    user:'abdulraouf8301@gmail.com',
    pass:'qtvd duqg jvai hodm'
   }
   });
   //now send mail
   var sendMessage ={
   from:'abdulraouf8301@gmail.com',
   to:req.body.email,
   subject:'Happy-Homes',
   text:'50%off'
   };

   sentinfo.sendMail(sendMessage,((err,info)=>{
    if(err){
        throw err;
    }
    else{
        console.log('email send sucess'+info.response);
    }
   }))

}).catch(()=>{
console.log("data failed to store");
})
});
//set login page
app.get("/login",(req,res)=>{
    res.render("login");
});
//set 
app.post("/login",async(req,res)=>{
    console.log(req.body.email);
    console.log(req.body.password);

 const email = req.body.email;
 const password = req.body.password;
 const checkemail = await Register.findOne({email:email});
if(checkemail.password===password)
{
console.log("log in sucess");
res.render("dashboard");
}
else{
    console.log("email is failed")

}
});
app.get("/dashboard",(req,res)=>{
    res.render("dashboard");
})