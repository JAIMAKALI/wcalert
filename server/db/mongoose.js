var mongoose=require('mongoose');

mongoose.Promise=global.Promise;

//var url = process.env.MONGOLAB_URI || ;
var url= "mongodb://users:Nitp@ds127801.mlab.com:27801/user"  //|| "mongodb://localhost:27017/Todoapp";

mongoose.connect(url);

module.exports={mongoose};


//mongodb://<dbuser>:<dbpassword>@ds127801.mlab.com:27801/user
//"mongodb://users:Nitp@ds127801.mlab.com:27801/user"
