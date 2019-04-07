;(function($){
	$('.btn-sub-comment').on('click',function(){
		var content=$('#comment-content').val().trim();
		var $err=$('.err');
		console.log(content)
		if(!content){
			$err.html('请输入评论内容');
			return false;
		}
		else if(content.length>10){
			$err.html('输入内容不能多于100个字符');
			return false;
		}
		else{
			$err.html('');
		}
		var id=$(this).data('id');
		$.ajax({
			url:'/comment/add',
			type:'post',
			dataType:'json',
			data:{
				content:content,
				article:id
			}
		})
		.done(function(result){
			$('#comment-content').val('');

			$('#comment-page').trigger('get-data',result.data);
		})
		.fail(function(err){
			console.log(err)
		})
	}) 
})(jQuery)