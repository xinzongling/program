
const express = require('express')
const artilceRouter = express.Router();


const pagination=require('../util/pagination.js');

const CategoryModel=require('../models/category.js')
const ArticleModel=require('../models/article.js')


//权限验证
artilceRouter.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next();
	}else{
		res.send('<h1>请用管理员的账号登录</h1>');
	}
});

//显示文章列表
artilceRouter.get('/',(req,res)=>{
	/*
	const options={
		page:req.query.page,
		model:ArticleModel,
		query:{},
		projection:'-__v',
		sort:{_id:1},
		populates:[{path:'user',select:'username'},{path:'category',select:'name'}]
	}
	pagination(options)
	.then(data=>{
		//console.log('data.docs',data.docs);
		res.render('admin/article_list',{
			userInfo:req.userInfo,
			articles:data.docs,
			page:data.page,
			arr:data.arr,
			pages:data.pages
		});
	})*/

	ArticleModel.getPaginationArticles(req)

	.then(data=>{
		res.render('admin/article_list',{
			userInfo:req.userInfo,
			articles:data.docs,
			page:data.page,
			arr:data.arr,
			pages:data.pages,
			url:'/article'
		});
	})
});


//显示添加分类页面
artilceRouter.get('/add',(req,res)=>{
	CategoryModel.find({},'name')
	.sort({order:-1})
	.then(categories=>{
		res.render('admin/article_add_edit',{
			userInfo:req.userInfo,
			categories
		});
	})
});


artilceRouter.post('/add',(req,res)=>{
	const { title,intro,content,category }=req.body;

	ArticleModel.insertMany({ //当插入数据类型和定义的数据类型不一致时,插入会出错
		title,
		intro,
		content,
		category,
		user:req.userInfo._id
	})
	.then(articles=>{
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'添加文章分类成功',
			url:'/article'
		});
	})
	.catch(err=>{
		res.render('admin/err',{
			userInfo:req.userInfo,
			message:'添加文章分类已失败,操作数据库错误,请稍后再试'
		});
	})
});
 
artilceRouter.get('/edit/:id',(req,res)=>{
	const { id }=req.params;
	CategoryModel.find({},'name')
	.sort({order:-1})
	.then(categories=>{
		ArticleModel.findById(id)
		.then(article=>{
			res.render('admin/article_add_edit',{
				userInfo:req.userInfo,
				article,
				categories
			});
		});
	})
});

//处理编辑
artilceRouter.post('/edit',(req,res)=>{
	const { id,title,intro,content,category }=req.body;; //编辑后的id,name,order
	ArticleModel.updateOne({_id:id},{title,intro,content,category})
	.then(result=>{
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'修改文章成功',
			url:'/article'
		});
	})
	.catch(err=>{
		res.render('admin/err',{
			userInfo:req.userInfo,
			message:'修改文章失败,请稍后再试'
		});
	})
});

//处理删除
artilceRouter.get('/delete/:id',(req,res)=>{
	const { id }=req.params;// /delete/:id,req.params {}
	ArticleModel.deleteOne({_id:id})
	.then(article=>{
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'删除文章分类成功',
			url:'/article'
		});
	})
	.catch(err=>{
		res.render('admin/err',{
			userInfo:req.userInfo,
			message:'删除文章分类已失败,操作数据库错误,请稍后再试'
		});
	})
})
module.exports = artilceRouter;