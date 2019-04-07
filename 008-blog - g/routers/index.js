
const express = require('express')
const router = express.Router();

const pagination=require('../util/pagination.js');

const CategoryModel=require('../models/category.js');
const ArticleModel=require('../models/article.js');
const CommentModel=require('../models/comment.js');

async function getCommonData(){
	const categoriesPromise= CategoryModel.find({});
	const topArticlesPromise=ArticleModel.find({},'_id click title').sort({click:-1}).limit(10)

	let categories = await categoriesPromise;
	let topArticles= await topArticlesPromise;

	return {
		categories,
		topArticles
	}
}

//显示首页
router.get('/',(req,res)=>{
	getCommonData()
	.then(data=>{
		const { categories,topArticles }=data;
		ArticleModel.getPaginationArticles(req)
		.then(pageArticles=>{
			res.render('main/index',{
				userInfo:req.userInfo,
				categories,
				topArticles,
				articles:pageArticles.docs,
				page:pageArticles.page,
				arr:pageArticles.arr,
				pages:pageArticles.pages,
				url:'/article'
			});
		})
	})
})

//处理文章数据的ajax请求
router.get('/articles',(req,res)=>{
	const {id}=req.query;

	const query={};
	if(id){
		query.category=id;
	}
	ArticleModel.getPaginationArticles(req,query)
	.then(data=>{
		res.json({
			status:0,
			data
		})
	})
})

async function getDetailData(req){
	const {id}=req.params;
	const CommonDataPromise=getCommonData();
	const articleDataPromise=ArticleModel.findOneAndUpdate({_id:id},{$inc:{click:1}},{new:true})
							.populate({path:'user',select:'username'})
							.populate({path:'category',select:'name'});

	const commentPageDation = CommentModel.getPaginationComments(req,{article:id});
	const data =await CommonDataPromise;
	const article =await articleDataPromise;
	const pageData =await commentPageDation;
	const { categories,topArticles }=data;
	return {
		categories,
		topArticles,
		article,
		pageData
	}
}

//详情页
router.get('/view/:id',(req,res)=>{
	//const {id}=req.params;
	getDetailData(req)
	.then(data=>{
		const {categories,topArticles,article,pageData }=data;
			res.render('main/detail',{
				userInfo:req.userInfo,
				categories,
				topArticles,
				article,
				category:article.category._id,//回传分类id,为了详情页对应导航选中
				comments:pageData.docs,//评论分页数据
				page:pageData.page,
				arr:pageData.arr,
				pages:pageData.pages
			});
	})
});

//列表页
router.get('/list/:id',(req,res)=>{
	const {id}=req.params;

	getCommonData()
	.then(data=>{
		const { categories,topArticles }=data;
		ArticleModel.getPaginationArticles(req,{category:id})
		.then(pageArticles=>{
			res.render('main/list',{
				userInfo:req.userInfo,
				categories,
				topArticles,
				articles:pageArticles.docs,
				page:pageArticles.page,
				arr:pageArticles.arr,
				pages:pageArticles.pages,
				url:'/article',
				category:id//回传返回id
			});
		})
	})
});

module.exports = router;