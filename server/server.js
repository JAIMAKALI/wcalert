
var express=require('express');
var request=require('request');
var plivo = require('plivo');
var app=express();
var path=require('path');
var bodyParser=require('body-parser');
var {mongoose}=require('./db/mongoose.js');
var {user}=require('./models/users.js');
var expressValidator=require('express-validator');

app.use(express.static(path.join(__dirname,'../public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(expressValidator());

var port=process.env.PORT || 3000;
app.get('/',(req,res)=>{

  res.sendFile(path.join(__dirname,'../public/start.html'));

});

app.get('/home',(req,res)=>{

  res.sendFile(path.join(__dirname,'../public/home.html'));

});

app.all('/login',(req,res)=>{
if(req.method.toLowerCase() != "post")
{
return res.sendFile(path.join(__dirname,'../public/login.html'));
}

user.findOne({email:req.body.email,password:req.body.psw}).then((docs)=>{
if(!docs)
{
  res.send('<script>alert("username and paasword is not valid"); window.location="/login"</script>');
}
else {
  res.send('welcome');
  //res.send('<script>alert("already registerd"); window.location="/login"</script>');
  // res.redirect('/login');
}
},(err)=>{
  console.log(err)
});

});


app.all('/register',(req,res)=>{
if(req.method.toLowerCase() != "post")
{
return res.sendFile(path.join(__dirname,'../public/register.html'));
}
//console.log(req.body);
req.checkBody('email', 'please enter valid email').notEmpty().isEmail();
 req.checkBody('name', 'please enter alphabetic username of length 3 to 16 letters').notEmpty().isAlphanumeric().len(3,20);
 req.checkBody('psw', 'please enter valid password').notEmpty().len(3,16);
 req.checkBody('psw_repeat', 'password length must be in btw 3-6').len(3,16);
 req.checkBody('psw_repeat', 'confired password must be equal to paasword').equals(req.body.psw);

var errors=req.validationErrors();

if(errors)
{
  return res.status(400).send('soory there is some thing wrong');
}

var name=req.body.name;
var email=req.body.email;
var password=req.body.psw;
var re_password=req.body.psw_repeat;



var users=new user({
  name:name,
  email:email,
  password:password
});

user.findOne({email:req.body.email,name:req.body.name}).then((docs)=>{
if(!docs)
{
  users.save().then((details)=>{
    console.log(details);
   res.status(200).send('u are succersfully registered');

  },(err1)=>{
    console.log(err1);
    res.status(400).send('opps');
  })
}
else {
  //res.send('already registered');
  res.send('<script>alert("already registerd"); window.location="/login"</script>');
  // res.redirect('/login');
}
},(errors)=>{
  console.log(err);
  res.send(errors);
});

});


 var references=[];
app.post('/send',(req,res)=>{
  var lat=req.body.persons_lat;
  var lon=req.body.persons_lon;

//  var url=`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=25.25,85.25&key=AIzaSyBdnIeUTSuNZWNG6o_GUq-SLDjTs02Og50&rankby=distance&type=police`;


//console.log(references);

  var p = plivo.RestAPI({
    authId: 'MANZK1YJIXNZLLMJU1OT',
    authToken: 'NzZjZDJjMjhiM2M4NThhNDI4ZDRjMTlmOWRiYjEw'
  });

  var params = {
      'src': '+919931897899', // Sender's phone number with country code
      'dst' : '+917004324388', // Receiver's phone Number with country code
      'text' : `Women is in needed at ${req.body.location_address} which coordinate is lat: ${lon} and lon:${lon}`// Your SMS Text Message - English

      //'url' : "http://example.com/report/", // The URL to which with the status of the message is sent
    //  'method' : "GET" // The method used to call the url
  };

  //Prints the complete response
  // p.send_message(params, function (status, response) {
  //     console.log('Status: ', status);
  //     console.log('API Response:\n', response);
  //     res.send(response);
  //
  // });
res.send(params);

})

app.listen(port,()=>{
  console.log('server is running on port 3000')
});


//authId: 'MANZK1YJIXNZLLMJU1OT',
  //authToken: 'NzZjZDJjMjhiM2M4NThhNDI4ZDRjMTlmOWRiYjEw'
//AIzaSyC-NiOCw2HMdw_NA54Nyc5qcho1GFrbI2M  map api

//authId: 'MAOGE4MTVKZGVKYZG4ZT',
//authToken: 'OTdiODcyNjQ3OWYzNzgzNzZhMjQwNGExMmI3N2M4'
