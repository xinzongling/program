
const express = require('express')
const userRouter = express.Router();

const hmac=require('../util/hmac.js');

const UserModel =require('../models/user.js');


//处理注册
userRouter.post('/register',(req,res)=>{
	const { username,password }=req.body;
	var result={
		status:0,//成功
		message:''
	}

	//检查是否已经注册过
	UserModel.findOne({username})
	.then(user=>{
		if(user){//用户已经存在
			result.status=10;
			result.message='用户已经存在';
			res.json(result);
		}else{
			UserModel.insertMany({
				username,
				password:hmac(password)
				//isAdmin:true
			})
			.then(user=>{
				res.json(result);
			})
			.catch(err=>{
				throw err;
			})
		}
	})
	.catch(err=>{//不是查询不到是的err
		result.status=10;
		result.message='服务器端错误,请稍后再试';
		res.json(result);
	})
});


//处理登录
userRouter.post('/login',(req,res)=>{
	const { username,password }=req.body;
	var result={
		status:0,//成功
		message:''
	};
	//检查是否已经注册过
	UserModel.findOne({username,password:hmac(password)},'-password -__v')
	.then(user=>{
		if(user){//登录成功
			result.data=user;
			//req.cookies.set('userInfo',JSON.stringify(user));
			req.session.userInfo = user;
			res.json(result);
		}else{
			result.status=10;
			result.message='用户名和密码不正确';
			res.json(result);
		}
	})
	.catch(err=>{//不是查询不到是的err
		result.status=10;
		result.message='服务器端错误,请稍后再试';
		res.json(result);
	})
});


//退出处理
userRouter.get('/logout',(req,res)=>{

	var result={
		status:0,//成功
		message:''
	};
	//req.cookies.set('userInfo',null);
	req.session.destroy();
	res.json(result);
});


module.exports = userRouter