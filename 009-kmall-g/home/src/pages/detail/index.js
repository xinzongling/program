require('pages/common/nav')
require('pages/common/search')
require('pages/common/footer')
require('util/pagination')
require('./index.css')

var _util = require('util')
var _product = require('service/product')
var _cart = require('service/cart')

var tpl = require('./index.tpl')

var page={
	parms:{
		productId:_util.getParamFromUrl('productId')||''
	},
	init:function(){
		this.$elem=$('.detail-box');
		this.onload();
		this.bindEvent();
	},
	bindEvent:function(){
		//1.图片的切换
		var _this = this;
		this.$elem.on('mouseenter','.product-small-img-item',function(){
			var $this=$(this);
			$this.addClass('active')
			.siblings('.product-small-img-item')
			.removeClass('active');
			var imgSrc=$this.find('img').attr('src');
			console.log(imgSrc)
			$('.product-main-img img').attr('src',imgSrc)
		})

		//实现数量的增加和减少
		this.$elem.on('click','.count-btn',function(){
			var $this=$(this);
			var $input=$('.count-input');
			var inputValue=$input.val()/1;
			if($this.hasClass('plus')){//增加
				if(inputValue>=_this.stock){
					inputValue==_this.stock;
					return;
				}
				inputValue=inputValue+1;
				$input.val(inputValue)
			}else if($this.hasClass('minus')){//减少
				if(inputValue<=1){
					return;
				}
				inputValue=inputValue-1;
				$input.val(inputValue)
			}
		})

		//3.添加购物车
		this.$elem.on('click','.add-cart-btn',function(){
			_cart.addCart({
				productId:_this.parms.productId,
				count:$('.count-input').val()
			},function(){
				window.location.href='./result.html?type=addCart';
			},function(msg){
				_util.showErrorMsg(msg);
			})
		})
	},
	onload:function(){
		if(this.parms.productId){
			this.loadProductDetail();
		}
	},
	loadProductDetail:function(){
		var _this = this;
		_product.getProductDetail(this.parms,function(product){
			if(product){
				product.images=product.images.split(',');
				product.mainImg=product.images[0];
				var html=_util.render(tpl,product);
				console.log('product...;;;,,,',product)
				console.log('product...;;;,,,',product)
				//缓存库存值用来处理商品数量时校验
				_this.stock=product.stock;
				_this.$elem.html(html)
			}
		},function(msg){

		})
	}
}


$(function(){
	page.init();
})