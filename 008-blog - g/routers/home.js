
const express = require('express')
const router = express.Router();

const multer  = require('multer')  //处理图片的上传
const upload = multer({dest:'static/uploads/'})


const hmac=require('../util/hmac.js');

const pagination=require('../util/pagination.js');
const CommentModel=require('../models/comment.js')

const UserModel=require('../models/user.js')
//登录验证
router.use((req,res,next)=>{
	if(req.userInfo._id){
		next();
	}else{
		res.send('<h1>请登录</h1>');
	}
});

//显示个人中心首页
router.get('/',(req,res)=>{
	res.render('home/index');
});

//评论
router.get('/comments',(req,res)=>{
	CommentModel.getPaginationComments(req,{user:req.userInfo._id})
	.then(data=>{
		res.render('home/comment_list',{
			userInfo:req.userInfo,
			comments:data.docs,
			page:data.page,
			arr:data.arr,
			pages:data.pages,
			url:'/home/comments'
		});
	})
})

//删除评论
router.get('/comment/delete/:id',(req,res)=>{
	const { id }=req.params;// /delete/:id,req.params {}
	CommentModel.deleteOne({_id:id,user:req.userInfo._id})
	.then(article=>{
		res.render('home/success',{
			userInfo:req.userInfo,
			message:'删除评论成功',
			url:'/home/comments'
		});
	})
	.catch(err=>{
		res.render('admin/err',{
			userInfo:req.userInfo,
			message:'删除评论已失败,操作数据库错误,请稍后再试'
		});
	})
})

//显示修改密码页面
router.get('/password',(req,res)=>{
	res.render('home/password',{
			userInfo:req.userInfo
		});
})

//修改密码
router.post('/password',(req,res)=>{
	const { password } =req.body;
	UserModel.updateOne({_id:req.userInfo._id},{password:hmac(password)})
	.then(result=>{
		req.session.destroy();
		res.render('home/success',{
			userInfo:req.userInfo,
			message:'修改密码成功,请重新登录',
			url:'/'
		});
	})
})
module.exports = router;