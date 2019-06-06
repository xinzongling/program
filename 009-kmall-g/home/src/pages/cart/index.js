require('pages/common/nav')
require('pages/common/search')
require('pages/common/footer')
require('./index.css')
var _util = require('util')
var _cart = require('service/cart')
var _nav = require('pages/common/nav')
var tpl = require('./index.tpl');

var page={
	init:function(){
		this.$elem = $('.cart-box');
		this.totalCartPrice=0;
		this.loadCart();
		this.bindEvent();
	},
	loadCart:function(){
		var _this = this;
		console.log('loadcart..')
		_cart.getCart(function(cart){
			console.log('cart....')
			console.log(cart)
			_this.renderCart(cart);
		},function(){
			console.log('cart error ....')
			_this.$elem.html('<p class="empty-msg">加载购物车失败!稍后再试</p>')	
		})

	},
	renderCart:function(cart){
		if(cart.cartList.length>0){
			console.log('cart,,,',cart)
			cart.cartList.forEach(function(item){
				console.log('item...',item)
				item.product.mainImg=item.product.images.split(',')[0];
			})
			this.totalCartPrice=cart.totalCartPrice;
			var html=_util.render(tpl,cart);
			this.$elem.html(html);
		}else{

		}
	},
	bindEvent:function(){
		var _this=this;
		//1.单个商品的选中与取消		
		this.$elem.on('click','.select-one',function(){
			var $this=$(this);
			var productId=$this.parents('.product-item').data('product-id');
			if($this.is(":checked")){
				_cart.selectOne({productId:productId},function(cart){
					_this.renderCart(cart);
				},function(msg){
					_util.showErrorMsg(msg);
				})
			}else{
				_cart.unselectOne({productId:productId},function(cart){
					_this.renderCart(cart);
				},function(msg){
					_util.showErrorMsg(msg);
				})
			}
		})
		//1.全选与全不选
		this.$elem.on('click','.select-all',function(){
			var $this=$(this);
			if($this.is(":checked")){
				_cart.selectAll(function(cart){
					_this.renderCart(cart);
				},function(msg){
					_util.showErrorMsg(msg);
				})
			}else{
				_cart.unselectAll(function(cart){
					_this.renderCart(cart);
				},function(msg){
					_util.showErrorMsg(msg);
				})
			}
		})
		//3.只删除一条
		this.$elem.on('click','.delete-one',function(){
			var $this=$(this);
			var productId=$this.parents('.product-item').data('product-id');
			_cart.deleteOne({productId:productId},function(cart){
				_this.renderCart(cart);
			},function(msg){
				_util.showErrorMsg(msg);
			})
		})
		//4.删除选中的商品
		this.$elem.on('click','.delete-selected',function(){	
			_cart.deleteSelected(function(cart){
				_this.renderCart(cart);
			},function(msg){
				_util.showErrorMsg(msg);
			})
		})
		//5.处理数量
		this.$elem.on('click','.count-btn',function(){
			var $this=$(this);
			var productId=$this.parents('.product-item').data('product-id');
			
			if($this.hasClass("plus")){//增加
				var count=$this.parents('.product-count').find('.count-input').val()/1;
				var stock=$this.parents('.product-count').find('.count-input').data('stock')/1;
				count>=stock?count=stock:count=count+1;
				count=count+1;
				$this.find('.count-input').val(count);
				_cart.updateCount({productId:productId,count:count},function(cart){
					_this.renderCart(cart);
				},function(msg){
					_util.showErrorMsg(msg);
				})
			}else if($this.hasClass("minus")){//减少
				var count=$this.parents('.product-count').find('.count-input').val()/1;
				count<=1?count=1:count=count-1;
				$this.find('.count-input').val(count);
				_cart.updateCount({productId:productId,count:count},function(cart){
					_this.renderCart(cart);
				},function(msg){
					_util.showErrorMsg(msg);
				})
			}
		})
		//6.去结算
		this.$elem.on('click','.btn-submit',function(){
			console.log(_this)
			if(_this.totalCartPrice>0){
				window.location.href='./order-confirm.html';
			}else{
				_util.showErrorMsg('请选中商品后再提交');
			}
		})
	}
}

$(function(){
	page.init();
})