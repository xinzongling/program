
class Index{//首页index.html
	index(req,res,...args){
		res.setHeader('Content-Type','text/html;charset=UTF-8');
		res.end('<a href="/wish/index">去许愿</a>');
	}
}
module.exports=new Index();