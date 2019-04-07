
var mongoose = require('mongoose');

//2定义Schema
	var UserSchema =new mongoose.Schema({
    	username:{
    		type:String
    	},
    	password:{
    		type:String
    	},
    	isAdmin:{
    		type:Boolean,
            default:false
    	}
	});

var UserModel = mongoose.model('user', UserSchema);

module.exports=UserModel;