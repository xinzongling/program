;(function($){
	function loadHtmlOnce($elem,callback){
		//发送ajax，获取数据
		var $layer=$elem.find('.dropdown-layer');
		var dataUrl=$elem.data('load');
		if(!dataUrl) return; //判断有无url;
		if($layer.data('isLoaded')) return;
		$.getJSON(dataUrl,function(data){
			callback($layer,data);			
		})
	};
	//加载图片
	function loadImage(imgUrl,success,fail){
		var image=new Image();
		image.onload=function(){
			success(imgUrl);
		};
		image.onerror=function(){
			fail(imgUrl);
		};
		image.src=imgUrl;
	};


	var menuDropdown=$('.nav-right .dropdown');
	menuDropdown.dropdown({
		js:true,
		mode:'slideUpDown'
	});
	menuDropdown.on('show',function(ev){
		loadHtmlOnce($(this),buildMenuItem);
		function buildMenuItem($layer,data){
			var html='';
			for(var i=0;i<data.length;i++){
				html+='<li><a href="'+data[i].url+'" class="menu-item">'+data[i].name+'</a></li>';
			};
			setTimeout(function(){
				$layer.html(html);
				$layer.data('isLoaded',true);
			},1000);
		}
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
		loadHtmlOnce($(this),buildCategoryItem);
		function buildCategoryItem($layer,data){
			var html='';
			html+='<dl>';
			for(var i=0;i<data.length;i++){
				html+='<dt>'+data[i].title+'</dt>';
				for(var j=0;j<data[i].items.length;j++){
					html+='<dd>'+data[i].items[i]+'</dd>';
				}
			};
			html+='</dl>';
			setTimeout(function(){
				$layer.html(html);
				$layer.data('isLoaded',true);
			},1000);
		}
	})

	/*轮播图*/
	var $carousel=$('.carousel-container');
	$carousel.on('carousel-show',function(err,index,elem){
		console.log(index,elem);
		var $img=$(elem).find('img');
		var imgUrl=$img.data('src');
		//$img.attr('src',imgUrl);
		//1,如果网络慢，会引起卡顿.2，请求错误，不易处理
		/*
		var image=new Image();
		image.onload=function(){
			$img.attr('src',imgUrl);
		};
		image.onerror=function(){
			$img.attr('src','images/focus-carousel/placeholder.png');
		};
		image.src=imgUrl;
		*/
		loadImage(imgUrl,function(imgUrl){
			$img.attr('src',imgUrl);
		},function(imgUrl){
			$img.attr('src','images/focus-carousel/placeholder.png');
		});
	})
	$carousel.carousel();
})(jQuery);