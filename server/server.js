
var express=require('express');
var request=require('request');
var plivo = require('plivo');
var app=express();
var path=require('path');
var bodyParser=require('body-parser');
var hbs=require('hbs');
var {mongoose}=require('./db/mongoose.js');
var {user}=require('./models/users.js');
var expressValidator=require('express-validator');

app.use(express.static(path.join(__dirname,'../public')));
app.use(express.static(path.join(__dirname,'../views')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(expressValidator());

//set a view engine hbs

app.set('view engine','hbs');
var port=process.env.PORT || 3000;
app.get('/',(req,res)=>{

  res.render('start');

});



app.all('/login',(req,res)=>{
if(req.method.toLowerCase() != "post")
{
return res.render('login');
}

user.findOne({email:req.body.email,password:req.body.psw}).then((docs)=>{
if(!docs)
{
  res.send('<script>alert("username and paasword is not valid"); window.location="/login"</script>');

}
else {
  res.render('dashboard');
}
},(err)=>{
  res.render('404');
});

});


app.all('/register',(req,res)=>{
if(req.method.toLowerCase() != "post")
{
return res.render('register');
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
  return res.status(400).render('register',{title:"application error",errors});
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
    //console.log(details);
   res.status(200).render('login',{success:'you are sucessfully register!'});

  },(err1)=>{
    console.log(err1);
    res.status(400).render('404');
  })
}
else {
  //res.send('already registered');
  res.send('<script>alert("already registerd.please login first"); window.location="/login"</script>');
  // res.redirect('/login');
}
},(errors)=>{
  console.log(err);
  res.render('404');
});

});


 var references=[];

app.post('/send',(req,res)=>{
  var lat=req.body.persons_lat;
  var lon=req.body.persons_lon;
var url=`https://www.google.com/maps?q=${lat},${lon}`;
  var p = plivo.RestAPI({
    authId: 'MANZK1YJIXNZLLMJU1OT',
    authToken: 'NzZjZDJjMjhiM2M4NThhNDI4ZDRjMTlmOWRiYjEw'
  });

  var params = {
      'src': '+919931897899', // Sender's phone number with country code
      'dst' : '+917004324388', // Receiver's phone Number with country code
      'text' : `Women is in needed at ${req.body.location_address} which coordinate is lat: ${lat} and lon:${lon} and ${url}`// Your SMS Text Message - English

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

});



app.all('/data',(req,res)=>{
  if(req.method.toLowerCase() != "post")
  {
  return res.render('data');
  }

  var state=req.body.state;
  var distric=req.body.distric;
  var link=`https://api.data.gov.in/resource/0df0735c-d685-4dcf-b927-1a6fa807b0a2?format=json&api-key=579b464db66ec23bdd0000018fa25d38d4dd467b73ff4aeefff65d7e&filters[states_uts]=${state}&fields=rape,murder,sexual_harassment,district,dowry_deaths`;
  request({
  url:link,
  json:true
  },(err,response,body)=>{
    if(err)console.log('something went wrong');

    //console.log(body.records);
    var data=body.records;
    res.render('data',{title:data});
  });



});


app.get('/home', function(req, res){
  res.render('home');
});


app.get('*', function(req, res){
  res.render('404');
});

app.listen(port,()=>{
  console.log('server is running on port 3000')
});


//authId: 'MANZK1YJIXNZLLMJU1OT',
  //authToken: 'NzZjZDJjMjhiM2M4NThhNDI4ZDRjMTlmOWRiYjEw'
//AIzaSyC-NiOCw2HMdw_NA54Nyc5qcho1GFrbI2M  map api

//authId: 'MAOGE4MTVKZGVKYZG4ZT',
//authToken: 'OTdiODcyNjQ3OWYzNzgzNzZhMjQwNGExMmI3N2M4'
//data gov api== 579b464db66ec23bdd0000018fa25d38d4dd467b73ff4aeefff65d7e
