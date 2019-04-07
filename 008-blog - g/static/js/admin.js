;(function($){
	//退出
	$('#logout').on('click',function(){
		$.ajax({
			url:'/user/logout'
		})
		.done(function(result){
			if(result.status==0){
				window.location.reload();
			}else{
				$('#userInfo .err').html(result.message);
			}
		})
		.fail(function(err){
			$('#userInfo .err').html('请求失败,请你稍后再试');
		})
	});
/*
	$('#user-list').on('click',function(){
		$.ajax({
			url:'/admin/userList',
			type:'get'
		})
	});*/  //如果是a标签,直接跳转地址,不用发送ajax,否则请求会出错
	//a连接,地址前一定加上/,否则请求也会出错


	
})(jQuery);