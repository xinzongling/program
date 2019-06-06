require('pages/common/footer')
require('pages/common/logo')
require('./index.css')
var _util = require('util')
var _user = require('service/user')
var formErr = {//表单信息填写错误时提示
	show:function(msg){//展示错误信息的DOM节点同时加上错误的文字内容
		console.log('msg',msg)
		$('.error-item')
		.show()
		.find('.error-msg')
		.text(msg)
	},
	hide:function(){//隐藏错误信息的DOM节点同时移出错误的文字内容
		$('.error-item')
		.hide()
		.find('.error-msg')
		.text('')		
	}
}
var page = {
	init:function(){
		this.bindEvent();
	},
	bindEvent:function(){ //绑定提交事件
		var _this = this;
		//当输入用户名后,鼠标离开input框,判断用户名是否存在,以给用户良好提示
		$('[name="username"]').on('blur',function(){
			var username = $(this).val();
			if(!_util.validate(username,'require')){
				return;
			}
			if(!_util.validate(username,'username')){
				return;
			}
			_user.checkUsername(username,function(){
				formErr.hide()
			},function(msg){
				formErr.show(msg)
			})
		})
		//1.用户注册
		$('#btn-submit').on('click',function(){
			_this.submitRegister();
		})
	},
	submitRegister:function(){ //获取值,验证,验证成功后发送ajax
		//1.获取数据
		console.log('register...')
		var formData = {
			username:$.trim($('[name="username"]').val()),
			password:$.trim($('[name="password"]').val()),
			repassword:$.trim($('[name="repassword"]').val()),
			phone:$.trim($('[name="phone"]').val()),
			email:$.trim($('[name="email"]').val())
		}
		//2.验证数据
		var validateResult = this.validate(formData)
		//3.发送请求
		if(validateResult.status){//验证通过
			formErr.hide()//如果验证通过,把失败信息隐藏,否则还会显示
			_user.register(formData,function(){
				window.location.href='/result.html?type=register'
			},function(msg){ //登录失败
				formErr.show(msg)
			})
		}
		else{// 验证失败(表单填写有误)
			formErr.show(validateResult.msg)
		}
	},
	validate:function(formData){//验证用户信息
		var result = {
			status:false,
			msg:''
		}
		//用户名不能为空
		if(!_util.validate(formData.username,'require')){
			result.msg = '用户名不能为空'
			console.log(result)
			return result;
		}
		//用户名格式不正确
		if(!_util.validate(formData.username,'username')){
			result.msg = '用户名格式不正确'
			return result;
		}
		//密码不能为空
		if(!_util.validate(formData.password,'require')){
			result.msg = '密码不能为空'
			return result;
		}
		//密码格式不正确
		if(!_util.validate(formData.password,'password')){
			result.msg = '密码格式不正确'
			return result;
		}
		//验证两次密码是否一致
		if(formData.password!==formData.repassword){
			result.msg = '两次密码不一致'
			return result;
		}
		//手机号不能为空
		if(!_util.validate(formData.phone,'require')){
			result.msg = '手机号不能为空'
			return result;
		}
		//手机号格式不正确
		if(!_util.validate(formData.phone,'phone')){
			result.msg = '手机号格式不正确'
			return result;
		}
		//邮箱不能为空
		if(!_util.validate(formData.email,'require')){
			result.msg = '邮箱不能为空'
			return result;
		}
		//邮箱格式不正确
		if(!_util.validate(formData.email,'email')){
			result.msg = '邮箱格式不正确'
			return result;
		}		
		result.status = true;
		return result;
	}
}
$(function(){//调用函数
	page.init();
})