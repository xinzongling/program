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
		//模拟网络延时
		setTimeout(function(){
			image.src=imgUrl;
		},1000)

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
	function carouselLazyLoad($elem){
		$elem.item={};//0:loaded
		$elem.totalItemNum=$elem.find('.carousel-item img').length;
		console.log('carouselLazyLoad',$elem.totalItemNum);
		$elem.totalLoadItemNum=0;
		$elem.carouselFn=null;
		//开始加载
		$elem.on('carousel-show',$elem.carouselFn=function(err,index,elem){
			console.log('will trigger...')		
			if($elem.item[index]!='loaded'){
				$elem.trigger('carousel-load',[index,elem]);
			};
		});
		//执行加载
		$elem.on('carousel-load',function(err,index,elem){
			var $imgs=$(elem).find('img');
			$imgs.each(function(){
				var $img=$(this);
				var imgUrl=$img.data('src');
				console.log('will load image..')
				loadImage(imgUrl,function(imgUrl){
					$img.attr('src',imgUrl);
				},function(imgUrl){
					$img.attr('src','images/focus-carousel/placeholder.png');
				});	
				$elem.item[index]='loaded';
				$elem.totalLoadItemNum++;
				if($elem.totalLoadItemNum==$elem.totalItemNum){
					$elem.trigger('carousel-loaded');
				}						
			});		
		});
		//结束加载
		$elem.on('carousel-loaded',function(){
			$elem.off('carousel-show',$elem.carouselFn);
		});		
	}

	var $carousel=$('.carousel-container');
	carouselLazyLoad($carousel);
	$carousel.carousel();
	/*下方的轮播图*/
	var $todaysCarousel=$('.todays .carousel-wrap');
	carouselLazyLoad($todaysCarousel);
	$todaysCarousel.carousel();


	/*楼层*/
	var $floor=$('.floor1');
	/*
	$floor.on('tab-show',function(err,index,elem){
		console.log(index,elem)
	});
	*/
		/*楼层图片的懒加载*/
	function floorLazyLoad($elem){
		$elem.item={};//0:loaded
		$elem.totalItemNum=$elem.find('.floor-item img').length;
		console.log('floorLazyLoad',$elem.totalItemNum);
		$elem.totalLoadItemNum=0;
		$elem.floorFn=null;
		//开始加载
		$elem.on('tab-show',$elem.floorFn=function(err,index,elem){
			console.log('will trigger...')		
			if($elem.item[index]!='loaded'){
				$elem.trigger('floor-load',[index,elem]);
			};
		});
		//执行加载
		$elem.on('floor-load',function(err,index,elem){
			var $imgs=$(elem).find('img');
			$imgs.each(function(){
				var $img=$(this);
				var imgUrl=$img.data('src');
				console.log('will load image..')
				loadImage(imgUrl,function(imgUrl){
					$img.attr('src',imgUrl);
				},function(imgUrl){
					$img.attr('src','images/floor/placeholder.png');
				});	
				$elem.item[index]='loaded';
				$elem.totalLoadItemNum++;
				if($elem.totalLoadItemNum==$elem.totalItemNum){
					$elem.trigger('floor-loaded');
				}						
			});		
		});
		//结束加载
		$elem.on('floor-loaded',function(){
			$elem.off('floor-show',$elem.floorFn);
		});		
	};
	floorLazyLoad($floor);
	$floor.tab();
})(jQuery);