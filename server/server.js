
var express=require('express');
var request=require('request');
var plivo = require('plivo');
var app=express();
var path=require('path');
var bodyParser=require('body-parser');
app.use(express.static(path.join(__dirname,'../public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.get('/',(req,res)=>{

  res.sendFile(path.join(__dirname,'../public/home.html'));

});
 var references=[];
app.post('/send',(req,res)=>{
  var lat=req.body.persons_lat;
  var lon=req.body.persons_lon;

  var url=`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=25.25,85.25&key=AIzaSyBdnIeUTSuNZWNG6o_GUq-SLDjTs02Og50&rankby=distance&type=police`;


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

app.listen(3000,()=>{
  console.log('server is running on port 3000')
});


//authId: 'MANZK1YJIXNZLLMJU1OT',
  //authToken: 'NzZjZDJjMjhiM2M4NThhNDI4ZDRjMTlmOWRiYjEw'
//AIzaSyC-NiOCw2HMdw_NA54Nyc5qcho1GFrbI2M  map api

//authId: 'MAOGE4MTVKZGVKYZG4ZT',
//authToken: 'OTdiODcyNjQ3OWYzNzgzNzZhMjQwNGExMmI3N2M4'
