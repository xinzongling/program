;(function($){

	var menuDropdown=$('.nav-right .dropdown');
	console.log(menuDropdown);
	menuDropdown.dropdown({
		js:true,
		mode:'slideUpDown'
	});
	menuDropdown.on('show',function(ev){
		//发送ajax，获取数据
		var $this=$(this);
		var $layer=$(this).find('.dropdown-layer');
		var dataUrl=$this.data('load');
		if(!dataUrl) return; //判断有无url;
		if($layer.data('isLoaded')) return;
		$.getJSON(dataUrl,function(data){
			var html='';
			for(var i=0;i<data.length;i++){
				html+='<li><a href="'+data[i].url+'" class="menu-item">'+data[i].name+'</a></li>';
			};
			setTimeout(function(){
				$layer.html(html);
				$layer.data('isLoaded',true);
			},1000);			
		})
	})

	/*搜索框*/
	var $search=$('.header .search');
	$search.search();
	$search.on('getData',function(err,data){
		var $this=$(this);
		var html=createSearchLayer(data,5);
		$this.search('appendHtml',html);
		if(html){
			$this.search('showLayer');
		}else{
			$this.search('hideLayer');
		}
	})
	.on('getNoData',function(){
		var $this=$(this);
		$this.search('appendLayer','').search('hideLayer');
	})
	.on('click','.search-item',function(){
		$search.search('setInputVal',$(this).html());
		$search.find('.search-form').trigger('submit');//.search-form 提交表单
	})
	function createSearchLayer(data,maxNum){
		if(data.result.length == 0){
			return '';
		}
		var html='';
		for(var i=0;i<data.result.length;i++){
			if(i>maxNum) break;
			html+='<li><a href="#" class="search-item">'+data.result[i]+'</a></li>';
		};

		return html;
	}
	


	/*分类面板*/
 	var $category=$('.category .dropdown');
	$category.dropdown({
		js:true,
		mode:'slideLeftRight',
		delay:600,
		eventName:'hover'
	});
	$category.on('show',function(ev){
		//发送ajax，获取数据
		var $this=$(this);
		var $layer=$(this).find('.dropdown-layer');
		var dataUrl=$this.data('load');
		if(!dataUrl) return; //判断有无url;
		if($layer.data('isLoaded')) return;
		$.getJSON(dataUrl,function(data){
			var html='';
			html+='<dl>';
			for(var i=0;i<data.length;i++){
				/*html+='<a>'+data[i].items+'</a>';*/
				html+='<dt>'+data[i].title+'</dt>';
				for(var j=0;j<data[i].items.length;j++){
					html+='<dd>'+data[i].items[i]+'</dd>';
				}
			};
			html+='</dl>'
			setTimeout(function(){
				$layer.html(html);
				$layer.data('isLoaded',true);
			},1000);			
		})
	})



	/*轮播图*/
	var $carousel=$('.carousel-container');
	$carousel.carousel();
})(jQuery);