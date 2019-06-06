var _util = require('util')

var _shipping = {
	getShippingList:function(success,error){
		_util.request({
			url:'/shipping/list',
			success:success,
			error:error			
		})		
	},
	getShipping:function(data,success,error){
		_util.request({
			url:'/shipping',
			data:data,
			success:success,
			error:error			
		})		
	},
	addShipping:function(data,success,error){
		_util.request({
			url:'/shipping',
			data:data,
			method:'post',
			success:success,
			error:error			
		})		
	},
	deleteShipping:function(data,success,error){
		_util.request({
			url:'/shipping/delete',
			data:data,
			method:'put',
			success:success,
			error:error			
		})		
	},
	editShipping:function(data,success,error){
		_util.request({
			url:'/shipping',
			data:data,
			method:'put',
			success:success,
			error:error			
		})		
	}
}

module.exports = _shipping;