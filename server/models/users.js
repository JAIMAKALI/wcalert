
var mongoose=require('mongoose');
var validator=require('validator');
  var Schema=new mongoose.Schema({
    name:{
      type:String,
      required:true

    },
    email:{
      type:String,
      required:true,
      unique:false,
      validate:{
        validator:validator.isEmail,
        message:"{value} is not valid email"
      }
    },
    password:{
      type:String,
      required:true
    }
  });


var user=mongoose.model('user',Schema);

module.exports={user};
