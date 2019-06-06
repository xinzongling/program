require('./index.css');
var _util = require('util')
var tpl = require('./index.tpl')
var _side={
	list:[
		{name:'user-info',href:'./user-center.html',desc:'用户中心'},
		{name:'ordre-list',href:'./order-list.html',desc:'我的订单'},
		{name:'user-update-password',href:'./user-update-password.html',desc:'修改密码'},
	],
	render:function(name){
		//默认让第几个对象加上isActive属性
		this.list.find(function(item){
			return item.name=name;
		}).isActive=true;
		var html=_util.render(tpl,{list:this.list});
		$('.side').html(html);
	}
}
module.exports=_side