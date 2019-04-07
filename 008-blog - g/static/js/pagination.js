;(function($){
	$.fn.extend({
		pagination:function(options){
			var self=$(this);
			self.on('click','a',function(){
				var $this=$(this);
				//1,计算页面
				var page=1;
				//2,获取页面
				var currentPage=self.find('.active a').html();
				//console.log(currentPage)
				//console.log(this)

				currentPage=currentPage*1;

				var labelText=$this.attr('aria-label');
				if(labelText=='Next'){
					page=currentPage+1;
				}else if(labelText=='Previous'){
					page=currentPage-1;
				}
				else{
					page=$this.html();
				}
				var url=options.url+"?page="+page
				var id=self.data('id');
				console.log('page',page)
				console.log('currentPage',currentPage)
				if(id){
					url+='&id='+id;
				}
				$.ajax({
					url:url,
					dataType:'json'
				})
				.done(function(result){
					if(result.status==0){
						self.trigger('get-data',result.data);
					}
				})
				.fail(function(err){
					console.log(err);
				})
			})
		}
	})
})(jQuery);