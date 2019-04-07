;(function($){
		
	var passwordReg=/^\w{3,6}$/;
	$('#btn-sub').on('click',function(){
		var passsword=$('[name=password]').val();
		var repasssword=$('[name=repassword]').val();
		var $errs=$('.err');

		if(!passwordReg.test(passsword)){
			$errs.eq(0).html('密码3-6位字符串');
			return false;
		}else{
			$errs.eq(0).html('');
		}
		if(passsword!==repasssword){
			$errs.eq(0).html('两次密码不一致');
			return false;
		}else{
			$errs.eq(1).html('');
		}
	});	
})(jQuery);