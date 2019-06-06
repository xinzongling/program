require('pages/common/nav')
require('pages/common/search')
require('pages/common/footer')
require('./index.css')
var _util = require('util')
var _payment = require('service/payment')
var tpl = require('./index.tpl');

var page={
	parms:{
		orderNo:_util.getParamFromUrl('orderNo')||''
	},
	init:function(){
		this.$paymentBox=$('.payment-box');
		this.loadPaymentInfo();
	},
	loadPaymentInfo:function(){
		var _this=this;
		if(_this.parms.orderNo){
			_payment.getPaymentInfo({orderNo:_this.parms.orderNo},function(payment){
				console.log('11::',payment)
				console.log('22::',payment.qrUrl)
				var html= _util.render(tpl,payment);
				_this.$paymentBox.html(html);
				_this.listenPaymentStatus();
			},function(){
				_this.$paymentBox.html('<p class="empty-msg">获取支付信息失败,请稍后再试!</p>')	
			})
		}
	},
	listenPaymentStatus:function(){
		var _this=this;
		setInterval(function(){
			_payment.getPaymentStatus({orderNo:_this.parms.orderNo},function(result){
				if(result){
					window.location.href='./result.html?type=payment&orderNo='+_this.parms.orderNo;
				}
			},function(err){
				console.log(err);
			});
		},1000);
	}
}
$(function(){
	page.init();
})