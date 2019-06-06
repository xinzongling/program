require('pages/common/nav')
require('pages/common/search')
require('pages/common/footer')
require('./index.css')
var _util = require('util')
var _order = require('service/order')
var _shipping = require('service/shipping')
var _modal = require('./modal.js')
var shippingTpl = require('./shipping.tpl')
var productTpl = require('./product.tpl')

var page={
	init:function(){
		this.$shippingBox = $('.shipping-box');
		this.$productBox= $('.product-box');
		this.totalCartPrice=0;
		this.selectedShippingId = '';
		this.onload();
		this.bindEvent();
	},
	onload:function(){
		this.loadShipping();
		this.loadProductList();
	},
	bindEvent:function(){
		var _this=this;
		this.$shippingBox.on('get-shippings',function(ev,shippings){
			_this.renderShipping(shippings)
		})
		//1.弹出地址框
		this.$shippingBox.on('click','.shipping-add',function(){
			_modal.show();
		})
		//2.删除地址
		this.$shippingBox.on('click','.shipping-delete',function(){
			var $this=$(this);
			var shippingId=$this.parents('.shipping-item').data('shipping-id');
			_shipping.deleteShipping({shippingId:shippingId},function(shippings){
				console.log('22::',shippings)
				_this.renderShipping(shippings)
			},function(msg){
				_util.showErrorMsg(msg)
			})
		})

		//3.编辑地址
		this.$shippingBox.on('click','.shipping-edit',function(ev){
			//阻止冒泡防止点击编辑时选中
			ev.stopPropagation();
			var $this=$(this);
			var shippingId=$this.parents('.shipping-item').data('shipping-id');
			_shipping.getShipping({shippingId:shippingId},function(shipping){
				_modal.show(shipping);
			})
		})

		//4.选择地址
		this.$shippingBox.on('click','.shipping-item',function(){
			var $this=$(this);
			$this.addClass('active').siblings().removeClass('active');
			
			//保存选中的地址ID
			_this.selectedShippingId=$this.data('shipping-id');
		})
		//5.去支付
		this.$productBox.on('click','.btn-submit',function(ev){
			if(_this.selectedShippingId){
				_order.createOrder({shippingId:_this.selectedShippingId},function(order){
					window.location.href='./payment.html?orderNo='+order.orderNo;
				},function(msg){
					_util.showErrorMsg(msg)
				})
			}else{
				_util.showErrorMsg('<h1>请选择商品后再支付</h1>')
			}
		})
	},
	loadShipping:function(){
		var _this = this;
		this.$shippingBox.on('get-shippings',function(ev,shippings){
			_this.renderShipping(shippings)
		})
		_shipping.getShippingList(function(shippings){
			_this.renderShipping(shippings)
		},function(msg){
			_util.showErrorMsg(msg)
		})
	},
	renderShipping:function(shippings){
		//标注别选中的地址
		var _this = this;
		shippings.forEach(function(shipping){
			if(shipping._id == _this.selectedShippingId){
				shipping.active = true
			}
		})

		var html = _util.render(shippingTpl,{
			shippings:shippings
		})
		this.$shippingBox.html(html)
	},
	loadProductList:function(){
		var _this=this;
		_order.getOrderProductList(function(result){
			console.log('result...',result)
			if(result.cartList.length>0){
				//处理图片
				result.cartList.forEach(function(item){
					item.product.mainImg=item.product.images.split(',')[0];
				})
				var html=_util.render(productTpl,result);
				_this.$productBox.html(html);
			}else{
				_this.$productBox.html('<p class="empty-msg">还没有选择购物车中的数据！！！</p>')
			}
		},function(msg){
			_this.$productBox.html('<p class="empty-msg">加载购物信息失败！！！</p>')
		})
	}
}

$(function(){
	page.init();
})