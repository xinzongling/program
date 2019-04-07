
const express = require('express')
const router = express.Router();

const multer  = require('multer')  //处理图片的上传
const upload = multer({dest:'static/uploads/'})


const hmac=require('../util/hmac.js');

const pagination=require('../util/pagination.js');
const CommentModel=require('../models/comment.js')

const UserModel=require('../models/user.js')



router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next();
	}else{
		res.send('<h1>请用管理员的账号登录</h1>');
	}
});

router.get('/',(req,res)=>{
	res.render('admin/index');
});
/*
router.get('/userList',(req,res)=>{
	UserModel.find({},'-password -__v')
	.then(users=>{
		res.render('admin/users-list',{
			userInfo:req.userInfo,
			users
		});
	})
});
*/
//用户列表分页显示

router.get('/userList',(req,res)=>{
	/*
	let { page } =req.query; //let定义的变量值可以改变,但是const一旦定义了就不可更改
	page=parseInt(page);

	if(!page){ //第一次进入用户列表,page没有输入,值为undefined
		page=1;
	}
	let limit=2;//每页显示多少条数据
	UserModel.countDocuments({})
	.then(count=>{
		let pages=Math.ceil(count/limit);
		if(page>=pages){
			page=pages;
		}
		//生成页码
		let arr=[];
		for(var i=1;i<=pages;i++){
			arr.push(i);
		}
		//分页显示
		let skip=limit*(page-1);
		UserModel.find({},'-password -__v')
		.skip(skip)
		.limit(limit)
		.then(users=>{
			res.render('admin/users-list',{
				userInfo:req.userInfo,
				users,
				page,
				arr
			});
		})
		.catch(err=>{
			console.log('err:::',err)
		})
	})*/

	const options={
		page:req.query.page,
		model:UserModel,
		query:{},
		projection:'-password -__v',
		sort:{'_id':1}
	}
	pagination(options)
	.then(data=>{
		res.render('admin/users-list',{
			userInfo:req.userInfo,
			users:data.docs,
			page:data.page,
			arr:data.arr,
			pages:data.pages
		});
	})
});

router.post('/uploadImages',upload.single('upload'),(req,res)=>{
	//upload.single('upload')把图片传送到前端
	let uploadedfilePath='/static/uploads/'+req.file.filename;//注意路径问题
	//console.log('req.file',req.file)	
	res.json({
		uploaded:true,
        url:uploadedfilePath
	});
})

//评论路由
router.get('/comments',(req,res)=>{
	CommentModel.getPaginationComments(req)
	.then(data=>{
		res.render('admin/comment_list',{
			userInfo:req.userInfo,
			comments:data.docs,
			page:data.page,
			arr:data.arr,
			pages:data.pages,
			url:'/admin/comments'
		});
	})
})

//处理删除
router.get('/comment/delete/:id',(req,res)=>{
	const { id }=req.params;// /delete/:id,req.params {}
	CommentModel.deleteOne({_id:id})
	.then(article=>{
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'删除评论成功',
			url:'/admin/comments'
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
	res.render('admin/password',{
			userInfo:req.userInfo
		});
})

//修改密码
router.post('/password',(req,res)=>{
	const { password } =req.body;
	UserModel.updateOne({_id:req.userInfo._id},{password:hmac(password)})
	.then(result=>{
		req.session.destroy();
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'修改密码成功,请重新登录',
			url:'/'
		});
	})
})
module.exports = router;