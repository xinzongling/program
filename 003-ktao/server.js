
var http=require('http');
var fs=require('fs');
var url=require('url');
var querystring=require('querystring')
var service=http.createServer(function (req,res) {
	res.setHeader('Content-Type','text/html;charset=UTF-8');
	if(req.method=='POST'){
		var body='';
		req.on('data',function(chunk){
			body+=chunk;
		});
		req.on('end',function(){
			console.log(body);
			var bodyObj=querystring.parse(body);
			var bodyStr=JSON.stringify(bodyObj);
			console.log(bodyObj);
			res.statusCode=200;
			res.end(bodyStr);
		});
	}else{
		var reg=/[?]/;
		if(reg.test(req.url)){
			var parms=url.parse(req.url).query;
			/*var parmsStr=JSON.stringify(parms);*/
			res.statusCode=200;
			res.end(parms);
		};
		var path='.'+req.url;
		console.log(path)
		fs.readFile(path,function(err,data){
			if(err){
				res.statusCode=404;
				res.end('file not found')
				console.log('get data error',err);
			}else{
				console.log('get data success',data);
				res.statusCode=200;
				res.end(data);
			}
		});
	}
});

service.listen(3000,'127.0.0.1',function(){
	console.log('server is running at 127.0.0.1:3000');
})