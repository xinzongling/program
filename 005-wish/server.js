
const http=require('http');

const fs=require('fs');
const path=require('path');
const mime=require('./mime.json');


const { add,get,remove }=require('./wishModel.js');

const server=http.createServer((req,res)=>{
	res.setHeader('Content-Type','text/html;charset=UTF-8');
	//如果请求的是根或index.html,返回index.html页面
	let reqUrl='.'+req.url;
	if(reqUrl=='./'||reqUrl=='./index.html'){//首页index.html
		get()
		.then(data=>{
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
				<div class="wall">`
				for(var i=0;i<data.length;i++){
					html+= `<div class="wish" style="background:${data[i].color}">
								<a href="JavaScript:;" class="close" data-id="${data[i].id}"></a>${data[i].content}
							</div>`						
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
				</html>`
			res.end(html);
		})
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