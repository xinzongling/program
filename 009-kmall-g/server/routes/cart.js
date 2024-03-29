/*
* @Author: Tom
* @Date:   2018-08-06 09:23:30
* @Last Modified by:   TomChen
* @Last Modified time: 2018-09-13 10:58:21
*/
const Router = require('express').Router;
const UserModel = require('../models/user.js');

const router = Router();

//获取购物车数量
router.get('/count',(req,res)=>{
	if(req.userInfo._id){
		UserModel.findById(req.userInfo._id)
		.then(user=>{
			if(user.cart){
				let count = 0;
				user.cart.cartList.forEach(item=>{
					count += item.count
				})
				res.json({
					code:0,
					data:count
				})
			}else{
				res.json({
					code:0,
					data:0
				})
			}
		})
		.catch(e=>{
			res.json({
				code:1,
				message:'获取购物车数量失败'
			})
		})		
	}else{
		res.json({
			code:0,
			data:0
		})
	}
	
})


//普通用户登录权限控制
router.use((req,res,next)=>{
	if(req.userInfo._id){
		next()
	}else{
		res.json({
			code:10
		})
	}
})

//添加购物车
router.post("/",(req,res)=>{
	let body = req.body;
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		//已有购物车
		if(user.cart){
			let cartItem = user.cart.cartList.find((item)=>{
				return item.product == body.productId
			})
			if(cartItem){
				cartItem.count = cartItem.count + parseInt(body.count)
			}else{
				user.cart.cartList.push({
					product:body.productId,
					count:body.count
				})				
			}

		}
		//没有购物车
		else{
			user.cart = {
				cartList:[
					{
						product:body.productId,
						count:body.count
					}
				]
			}
		}
		user.save()
		.then(newUser=>{
			res.json({
				code:0,
				message:'购物车添加成功'
			})
		})
	})
});

//获取购物车信息
router.get('/',(req,res)=>{
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		user.getCart()
		.then(cart=>{
			console.log('cart...',cart)
			res.json({
				code:0,
				data:cart
			})			
		})
	})
	.catch(e=>{
		console.log('e...',e)
		res.json({
			code:1,
			message:'获取购物车失败'
		})
	})	
})


//选中购物车中一项
router.put("/selectOne",(req,res)=>{
	let body = req.body;
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		//已有购物车
		if(user.cart){
			let cartItem = user.cart.cartList.find((item)=>{
				return item.product == body.productId
			})
			if(cartItem){
				cartItem.checked = true
			}else{
				res.json({
					code:1,
					message:'购物车记录不存在'
				})			
			}

		}
		//没有购物车
		else{
			res.json({
				code:1,
				message:'还没有购物车'
			})
		}
		user.save()
		.then(newUser=>{
			user.getCart()
			.then(cart=>{
				res.json({
					code:0,
					data:cart
				})			
			})
		})
	})
});

//取消购物车中一项
router.put("/unselectOne",(req,res)=>{
	let body = req.body;
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		//已有购物车
		if(user.cart){
			let cartItem = user.cart.cartList.find((item)=>{
				return item.product == body.productId
			})
			if(cartItem){
				cartItem.checked = false
			}else{
				res.json({
					code:1,
					message:'购物车记录不存在'
				})			
			}

		}
		//没有购物车
		else{
			res.json({
				code:1,
				message:'还没有购物车'
			})
		}
		user.save()
		.then(newUser=>{
			user.getCart()
			.then(cart=>{
				res.json({
					code:0,
					data:cart
				})			
			})
		})
	})
});

//全部选中购物车
router.put("/selectAll",(req,res)=>{
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		//已有购物车
		if(user.cart){
			user.cart.cartList.forEach(item=>{
				item.checked = true;
			})
		}
		//没有购物车
		else{
			res.json({
				code:1,
				message:'还没有购物车'
			})
		}
		user.save()
		.then(newUser=>{
			user.getCart()
			.then(cart=>{
				res.json({
					code:0,
					data:cart
				})			
			})
		})
	})
});

//全部取消购物车
router.put("/unselectAll",(req,res)=>{
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		//已有购物车
		if(user.cart){
			user.cart.cartList.forEach(item=>{
				item.checked = false;
			})
		}
		//没有购物车
		else{
			res.json({
				code:1,
				message:'还没有购物车'
			})
		}
		user.save()
		.then(newUser=>{
			user.getCart()
			.then(cart=>{
				res.json({
					code:0,
					data:cart
				})			
			})
		})
	})
});

//删除一条购物车信息
router.put("/deleteOne",(req,res)=>{
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		//已有购物车
		if(user.cart){
			let newCartList = user.cart.cartList.filter(item=>{
				return item.product != req.body.productId
			})
			user.cart.cartList = newCartList;
		}
		//没有购物车
		else{
			res.json({
				code:1,
				message:'还没有购物车'
			})
		}
		user.save()
		.then(newUser=>{
			user.getCart()
			.then(cart=>{
				res.json({
					code:0,
					data:cart
				})			
			})
		})
	})
});

//删除选中的购物车信息
router.put("/deleteSelected",(req,res)=>{
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		//已有购物车
		if(user.cart){
			let newCartList = user.cart.cartList.filter(item=>{
				return item.checked == false;
			})
			user.cart.cartList = newCartList;
		}
		//没有购物车
		else{
			res.json({
				code:1,
				message:'还没有购物车'
			})
		}
		user.save()
		.then(newUser=>{
			user.getCart()
			.then(cart=>{
				res.json({
					code:0,
					data:cart
				})			
			})
		})
	})
});

//修改数量
router.put("/updateCount",(req,res)=>{
	let body = req.body;
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		//已有购物车
		if(user.cart){
			let cartItem = user.cart.cartList.find((item)=>{
				return item.product == body.productId
			})
			if(cartItem){
				cartItem.count = body.count
			}else{
				res.json({
					code:1,
					message:'购物车记录不存在'
				})			
			}

		}
		//没有购物车
		else{
			res.json({
				code:1,
				message:'还没有购物车'
			})
		}
		user.save()
		.then(newUser=>{
			user.getCart()
			.then(cart=>{
				res.json({
					code:0,
					data:cart
				})			
			})
		})
	})
});
module.exports = router;