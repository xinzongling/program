var _util = require('util')

var _shipping = require('service/shipping')
var modalTpl = require('./modal.tpl')
var _cities = require('util/cities')

var formErr = {
	show:function(msg){
		$('.error-item')
		.show()
		.find('.error-msg')
		.text(msg)
	},
	hide:function(){
		$('.error-item')
		.hide()
		.find('.error-msg')
		.text('')		
	}
}

var _modal={
	show:function(shipping){
		this.$modalBox = $('.modal-box')
		//编辑时传入需要编辑的地址对象
		this.shipping = shipping;
		this.loadModal();
		this.bindEvent();
	},
	loadModal:function(){
		var html = _util.render(modalTpl,this.shipping);
		this.$modalBox.html(html);
		this.loadProvinces();
	},
	loadProvinces:function(){
		var provinces = _cities.getProvinces();
		var provincesOptions = this.getSelectOptions(provinces);
		var $provincesSelect = $('.province-select');
		$provincesSelect.html(provincesOptions)

		//编辑时回填省份
		if(this.shipping){
			$provincesSelect.val(this.shipping.province)
			this.loadCities(this.shipping.province)
		}

	},
	getSelectOptions:function(arr){
		var html = '<option value="">请选择</option>';
		for(var i = 0;i<arr.length;i++){
			html += '<option value="'+arr[i]+'">'+arr[i]+'</option>'
		}
		return html;
	},
	hideModal:function(){
		this.$modalBox.empty();
	},
	loadCities:function(provinceName){
		var cities=_cities.getCities(provinceName);
		var citiesOptions = this.getSelectOptions(cities);
		var $citiesSelect = $('.city-select');
		$citiesSelect.html(citiesOptions);

		//编辑时回填城市
		if(this.shipping){
			$citiesSelect.val(this.shipping.city)
		}

	},
	bindEvent:function(){
		var _this = this;
		//1.关闭弹出框
		this.$modalBox.on('click','.close',function(){
			_this.hideModal();
		})
		//阻止冒泡
		this.$modalBox.on('click','.modal-container',function(ev){
			ev.stopPropagation();
		})
		//2.监听省份事件获取城市
		this.$modalBox.on('change','.province-select',function(){
			var $this = $(this);
			_this.loadCities($this.val());
		})
		//3.点击提交
		this.$modalBox.on('click','.btn-submit',function(){
			_this.submit();
		})
	},
	submit:function(){
		var _this = this;
		//1.获取表单数据
		var formData={//属性选择器中的引号一定是双引号
			name:$.trim($('[name="name"]').val()),
			province:$.trim($('[name="province"]').val()),
			city:$.trim($('[name="city"]').val()),
			address:$.trim($('[name="address"]').val()),
			phone:$.trim($('[name="phone"]').val()),
			zip:$.trim($('[name="zip"]').val()),
		}
		//2.进行表单数据的验证
		var validateResult = this.validate(formData);
		if(validateResult.status){
			formErr.hide();
			if(this.shipping){//编辑地址
				formData.shippingId = this.shipping._id;
				_shipping.editShipping(formData,function(shippings){
					_util.showSuccessMsg('编辑地址成功')
					$('.shipping-box').trigger('get-shippings',[shippings])
					_this.hideModal()
				},function(msg){
					formErr.show(msg)
				})
			}else{//添加地址
				_shipping.addShipping(formData,function(shippings){
					_util.showSuccessMsg('编辑地址成功')
					$('.shipping-box').trigger('get-shippings',[shippings])
					_this.hideModal();
				},function(msg){
					formErr.show(msg)
				})
			}
		}else{
			//验证失败
			formErr.show(validateResult.msg);
		}
	},
	validate:function(formData){
		var result = {
			status:false,
			msg:''
		}
		//收货人姓名不能为空
		if(!_util.validate(formData.name,'require')){
			result.msg = '收货人姓名不能为空'
			return result;
		}
		//省份不能为空
		if(!_util.validate(formData.province,'require')){
			result.msg = '省份不能为空'
			return result;
		}
		//城市不能为空
		if(!_util.validate(formData.city,'require')){
			result.msg = '城市不能为空'
			return result;
		}
		//地址不能为空
		if(!_util.validate(formData.address,'require')){
			result.msg = '地址不能为空'
			return result;
		}
		//手机号码不能为空
		if(!_util.validate(formData.phone,'require')){
			result.msg = '手机号码不能为空'
			return result;
		}						
		//手机号码格式不正确
		if(!_util.validate(formData.phone,'phone')){
			result.msg = '手机号码格式不正确'
			return result;
		}
		result.status = true;
		return result;
	}
}
module.exports = _modal