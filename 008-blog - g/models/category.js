
var mongoose = require('mongoose');

//2定义Schema
	var CategorySchema =new mongoose.Schema({
    	name:{
    		type:String
    	},
    	order:{
    		type:Number
    	}
	});

var CategoryModel = mongoose.model('category', CategorySchema);

module.exports=CategoryModel;