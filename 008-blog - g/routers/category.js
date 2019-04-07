
const express = require('express')
const router = express.Router();


const pagination=require('../util/pagination.js');
const CategoryModel=require('../models/category.js')

//权限验证
router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next();
	}else{
		res.send('<h1>请用管理员的账号登录</h1>');
	}
});

//显示分类列表
router.get('/',(req,res)=>{
	const options={
		page:req.query.page,
		model:CategoryModel,
		query:{},
		projection:'-__v',
		sort:{order:1}
	}
	pagination(options)
	.then(data=>{
		res.render('admin/category_list',{
			userInfo:req.userInfo,
			categories:data.docs,
			page:data.page,
			arr:data.arr,
			pages:data.pages
		});
	})
});


//显示添加分类页面
router.get('/add',(req,res)=>{
	res.render('admin/category_add_edit',{
		userInfo:req.userInfo
	});
});


router.post('/add',(req,res)=>{
	const { name,order }=req.body;
	CategoryModel.findOne({name})
	.then(category=>{
		if(category){//已经存在同名的分类
			res.render('admin/err',{
				userInfo:req.userInfo,
				message:'添加分类已失败,已经存在同类用户名'
			});
		}else{
			CategoryModel.insertMany({name,order})
			.then(categories=>{
				res.render('admin/success',{
					userInfo:req.userInfo,
					message:'添加分类成功',
					url:'/category'
				});
			})
			.catch(err=>{
				throw err;
			})
		}
	})
	.catch(err=>{
		res.render('admin/err',{
			userInfo:req.userInfo,
			message:'添加分类已失败,操作数据库错误,请稍后再试'
		});
	})
});
 

router.get('/edit/:id',(req,res)=>{
	const { id }=req.params;
	CategoryModel.findById(id)
	.then(category=>{
		res.render('admin/category_add_edit',{
			userInfo:req.userInfo,
			category
		});
	})
})


router.post('/edit',(req,res)=>{
	const { id,name,order }=req.body; //编辑后的id,name,order
	CategoryModel.findById(id)
	.then(category=>{
		if(category.name==name&&category.order==order){//指的是没有任何的编辑
			res.render('admin/err',{
				userInfo:req.userInfo,
				message:'编辑失败,请编辑后再提交'
			});
		}else{
			CategoryModel.find({name:name})
			.then(category=>{
				if(category.length==0){//查不到,
					CategoryModel.updateOne({_id:id},{name,order})
					.then(result=>{
						res.render('admin/success',{
							userInfo:req.userInfo,
							message:'添加分类成功',
							url:'/category'
						});
					})
					.catch(err=>{
						throw err;
					})
				}else{
					res.render('admin/err',{
						userInfo:req.userInfo,
						message:'编辑失败,分类名已存在'
					});
				}
			})
			.catch(err=>{ //err不是查询不到时的err
				throw err;
			})
		}
	})
	.catch(err=>{
		res.render('admin/err',{
			userInfo:req.userInfo,
			message:'添加分类已失败,操作数据库错误,请稍后再试'
		});
	})
});

router.get('/delete/:id',(req,res)=>{
	const { id }=req.params;
	CategoryModel.deleteOne({_id:id})
	.then(category=>{
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'删除分类成功',
			url:'/category'
		});
	})
	.catch(err=>{
		res.render('admin/err',{
			userInfo:req.userInfo,
			message:'删除分类已失败,操作数据库错误,请稍后再试'
		});
	})
})
module.exports = router;