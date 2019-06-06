require('pages/common/footer')
require('pages/common/logo')
require('./index.css')
var _util = require('util')

$(function(){ //接收url中的参数
	var type = _util.getParamFromUrl('type') || 'default';
	//console.log('type...',type)
	//拿到的type为register
	var orderNo=_util.getParamFromUrl('orderNo');
	var $elem=$('.btn-detail-orderNo');
	var href=$elem.attr('href')+orderNo;
	$elem.attr('href',href);
	$('.'+type).show()
})