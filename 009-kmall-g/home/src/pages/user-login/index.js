require('pages/common/footer')
require('pages/common/logo')
require('./index.css')
var _util = require('util')
var _user = require('service/user')
var formErr = {//表单信息填写错误时提示
	show:function(msg){//展示错误信息的DOM节点同时加上错误的文字内容
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
		//1.用户登录
		$('#btn-submit').on('click',function(){
			_this.submitLogin();
		})
	},
	submitLogin:function(){ //获取值,验证,验证成功后发送ajax
		//1.获取数据
		var formData = {
			username:$.trim($('[name="username"]').val()),
			password:$.trim($('[name="password"]').val())
		}
		//2.验证数据
		var validateResult = this.validate(formData)
		//3.发送请求
		if(validateResult.status){//验证通过
			formErr.hide()//如果验证通过,把失败信息隐藏,否则还会显示
			_user.login(formData,function(){
				_util.goHome()
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
		result.status = true;
		return result;
	}
}
$(function(){//调用函数
	page.init();
})