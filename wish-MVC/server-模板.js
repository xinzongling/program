const http=require('http');
const fs=require('fs');
const path=require('path');
const url=require('url');
const querystring=require('querystring');

const mime=require('./mime.json');

const server=http.createServer((req,res)=>{
	res.setHeader('Content-Type','text/html;charset=UTF-8');



console.log('requrl;;;;;;',req.url)
	let pathName=url.parse(req.url,true).pathname;
	let reqUrl='.'+req.url;

	//约定：1,以/static/开头的请求路径是静态资源
	//路由请求的约定：/Controller/action/arg1/arg2
				//   /wish/add
				//   /wish/del/123
				//   /wish/index

	if(req.url.startsWith('/static/')){//静态资源处理
		let pathName='.'+req.url;
		// pathName='./static/'+pathName;
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
	}else{ //路由的处理
		let paths=req.url.split('/');
		let controller=paths[1] || 'wish' ;
		let action=paths[2] || 'index' ;
		let args=paths.slice(3);

		try{
			let mode=require('./Controller/'+controller);
			if(mode){
				mode[action]&&mode[action].apply(null,[req,res].concat(args));
			}
		}
		catch(err){
			console.log('err....',err);
			res.setHeader('Content-Type','text/html;charset=UTF-8');
			res.statusCode=500;
			res.end('<h1>出错啦</h1>');
		}

	}
});
server.listen(3000,'127.0.0.1',()=>{
	console.log('server is running at 127.0.0.1:3000');
});