const swig  = require('swig');
const url=require('url');
const querystring=require('querystring');
const { add,get,remove }=require('../model/wishModel.js');

class Wish{//首页index.html
	index(req,res,...args){
		get()
		.then(data=>{
			let template = swig.compileFile(__dirname+'/../view/wish/index.html');
			let html = template({//模板实现了html和数据的分类
				data:data
			});
			res.end(html);
		})
	}
	add(req,res,...args){
		//获取前端发来的数据
		let body='';
		req.on('data',(chunk)=>{
			body+=chunk;
		});
		req.on('end',()=>{
			let obj=querystring.parse(body);
			add(obj)
			.then(data=>{//status:0成功，1，失败
				res.end(JSON.stringify({status:0,data:data}));
			})
			.catch(err=>{
				res.end(JSON.stringify({status:0,message:'许愿失败'}));
			});
		});
	}
	del(req,res,...args){
		//获取前端发来的数据
		remove(args[0])
		.then(data=>{
			res.end(JSON.stringify({status:0,data:data}));
		})
		.catch(err=>{
			res.end(JSON.stringify({status:10,message:'删除失败'}));
		});
	}
}
module.exports=new Wish();