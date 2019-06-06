var hogan = require('hogan.js');
var _util = {
	request:function(options){//向后台发送ajax
		console.log('request...')
		console.log('options...',options)
		var _this = this;
		$.ajax({
			method:options.method || 'get',
			url:options.url || '',
			dataType:options.dataType || 'json',
			data:options.data || '',
			success:function(result){ //发送ajax成功了
				console.log('result...',result)
				//成功
				if(result.code == 0){
					options.success && options.success(result.data)
				}
				//失败 (指的是内部的逻辑)
				else if(result.code == 1){
					options.error && options.error(result.message)
				}
				//没有权限
				else if(result.code == 10){
					//跳转到登录页面
					_this.goLogin();
				}
			},
			error:function(err){  //发送ajax失败了
				console.log('err...',err)
				options.error && options.error(err.statusText)
			}
		})
	},
	confirm:function(msg){
		return window.confirm(msg)
	},
	showErrorMsg:function(msg){//展示错误信息
		alert(msg)
	},
	showSuccessMsg:function(msg){//展示成功信息
		alert(msg)
	},
	goLogin:function(){ //当登录失败后,直接跳转到去登录的页面
		window.location.href = './user-login.html'
	},
	goHome:function(){  //当登录成功后,直接跳转到去home页
		window.location.href = '/'
	},
	getParamFromUrl:function(key){
		//?type=register
		//?name=tom&&type=register
		//?name=tom&&type=register&&id=123
		var query = window.location.search.substr(1);
		//substr方法用于字符串的截取 //query为'type=register'
		var reg = new RegExp('(^|&)'+key+'=([^&]*)(&|$)');
		//正则,加上括号是为了分组
		var result = query.match(reg);
		//["type=register", "", "register", "", index: 0, input: "type=register"]
		return result ? decodeURIComponent(result[2]) : null;
	},		
	validate:function(value,type){//关于验证(验证的值,验证的类型)		
		var value = $.trim(value);
		//非空验证
		if(type == 'require'){
			return !!value;
		}
		//用户名格式验证
		if(type == 'username'){
			return /^[a-zA-Z0-9_]{3,6}$/.test(value);
		}
		//密码格式验证
		if(type == 'password'){
			return /^[a-zA-Z0-9_]{3,6}$/.test(value);
		}
		//电话号码格式验证
		if(type == 'phone'){
			return /^1[13578]\d{9}$/.test(value);
		}
		//电子邮箱格式验证
		if(type == 'email'){
			return /^\w+@\w+\.\w{2,6}$/.tesst(value);
		}
	},
	render:function(tpl,data){
		var compiledTemplate = hogan.compile(tpl);
		var result = compiledTemplate.render(data);
		return result;
	}
}

module.exports = _util;