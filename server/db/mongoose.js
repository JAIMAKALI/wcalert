var mongoose=require('mongoose');

mongoose.Promise=global.Promise;

//var url = process.env.MONGOLAB_URI || ;

mongoose.connect("mongodb://users:Nitp@ds127801.mlab.com:27801/user");

module.exports={mongoose};


//mongodb://<dbuser>:<dbpassword>@ds127801.mlab.com:27801/user
