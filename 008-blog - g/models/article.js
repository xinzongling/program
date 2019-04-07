
var mongoose = require('mongoose');
const pagination=require('../util/pagination.js');
//2定义Schema
	var ArticleSchema =new mongoose.Schema({
    	title:{
    		type:String
    	},
    	intro:{
    		type:String
    	},
    	content:{
    		type:String
    	},
    	user:{
    		type:mongoose.Schema.Types.ObjectId,
            ref:'user'
    	},
    	category:{
			type:mongoose.Schema.Types.ObjectId,
            ref:'category'
    	},
    	createTime:{
    		type:Date,
    		default:Date.now
    	},
    	click:{
    		type:Number,
    		default:0
    	}
	});


//一定要在生成model之前定义静态方法
ArticleSchema.statics.getPaginationArticles=function(req,query={}){//在Schema上定义静态方法
    console.log('query,,,,,',query)

    const options={
        page:req.query.page,
        model:this,
        query:query,
        projection:'-__v',
        sort:{_id:1},
        populates:[{path:'user',select:'username'},{path:'category',select:'name'}]
    }
    return pagination(options);
}


var ArticleModel = mongoose.model('article', ArticleSchema);
module.exports=ArticleModel;