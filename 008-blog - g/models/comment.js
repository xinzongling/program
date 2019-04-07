
var mongoose = require('mongoose');
const pagination=require('../util/pagination.js');
//2定义Schema
	var CommentSchema =new mongoose.Schema({
    	content:{
    		type:String
    	},
    	user:{
    		type:mongoose.Schema.Types.ObjectId,
            ref:'user'
    	},
    	article:{
			type:mongoose.Schema.Types.ObjectId,
            ref:'article'
    	},
    	createTime:{
    		type:Date,
    		default:Date.now
    	}
	});


//一定要在生成model之前定义静态方法
CommentSchema.statics.getPaginationComments=function(req,query={}){//在Schema上定义静态方法
    console.log('query,,,,,',query)

    const options={
        page:req.query.page,
        model:this,
        query:query,
        projection:'-__v',
        sort:{_id:-1},
        populates:[{path:'user',select:'username'},{path:'article',select:'title'}]
    }
    return pagination(options);
}


var CommentModel = mongoose.model('Comment', CommentSchema);
module.exports=CommentModel;