
const http=require('http');

const fs=require('fs');
const path=require('path');
const url=require('url');
const querystring=require('querystring');


const mime=require('./mime.json');

const swig  = require('swig');

const { add,get,remove }=require('./wishModel.js');

const server=http.createServer((req,res)=>{
	res.setHeader('Content-Type','text/html;charset=UTF-8');
	//如果请求的是根或index.html,返回index.html页面

	console.log(req.url);
	let pathName=url.parse(req.url,true).pathname;

	let reqUrl='.'+req.url;
	if(reqUrl=='./'||reqUrl=='./index.html'){//首页index.html
		get()
		.then(data=>{/*
			console.log(data);
			let html='';
			html+=`<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<title>许愿墙</title>
					<link rel="stylesheet" href="css/index.css">
				</head>
				<body>;
				<div class="wall">`;
				for(var i=0;i<data.length;i++){
					html+= `<div class="wish" style="background:${data[i].color}">
								<a href="JavaScript:;" class="close" data-id="${data[i].id}"></a>${data[i].content}
							</div>`;						
				};
				html+= `</div>
				  <div class="form-box">
						<div>
							<textarea name="content" id="content" cols="30" rows="30"></textarea>
						</div>
						<div>
							<a href="JavaScript:;" class="sub-btn">许下心愿</a>
						</div>
					</div>
				</body>
				<script src="lib/jQuery/jquery-1.12.4.min.js"></script>
				<script src="lib/jquery.pep.js-master/src/jquery.pep.js"></script>
				<script src="js/index.js"></script>
				</html>`;
			res.end(html);*/

			let template = swig.compileFile(__dirname+'/static/index.html');
			let html = template({//模板实现了html和数据的分类
				data:data
			});
			res.end(html);
		})
	}else if(req.url=='/add'&&req.method=='POST'){
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
				res.end(JSON.stringify({status:1,message:'许愿失败'}));
			});
		});
	}else if(url.parse(req.url,true).pathname=='/del'){
		//获取前端发来的数据
		let obj=url.parse(req.url,true).query;
		remove(obj.id)
		.then(data=>{
			res.end(JSON.stringify({status:0,data:data}));
		})
		.catch(err=>{
			res.end(JSON.stringify({status:10,message:'删除失败'}));
		});

	}else{//静态资源,index.html引入的其它文件
		let pathName=req.url;
		pathName='./static/'+pathName;
		let extName=path.extname(pathName);
		fs.readFile(pathName,(err,data)=>{
			if(err){
				res.setHeader('Content-Type','text/html;charset=UTF-8');
				res.statusCode=500;
				res.end('<h1>请求出错啦</h1>');
			}else{
				res.setHeader('Content-Type',mime[extName]+';charset=UTF-8');
				res.statusCode=200;
				res.end(data);
			}
		});
	};
});
server.listen(3000,'127.0.0.1',()=>{
	console.log('server is running at 127.0.0.1:3000');
});