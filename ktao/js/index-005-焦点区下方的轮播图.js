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
	/*
	var $carousel=$('.carousel-container');
	var item={};//0:loaded
	var totalItemNum=$carousel.find('.carousel-item').length;
	var totalLoadItemNum=0;
	var carouselFn=null;
	$carousel.on('carousel-show',carouselFn=function(err,index,elem){
		console.log('will trigger...')
		console.log(index,elem);
		var $img=$(elem).find('img');
		var imgUrl=$img.data('src');
		if(item[index]!='loaded'){
			console.log('will load image..')
			loadImage(imgUrl,function(imgUrl){
				$img.attr('src',imgUrl);
			},function(imgUrl){
				$img.attr('src','images/focus-carousel/placeholder.png');
			});	
			item[index]='loaded';
			totalLoadItemNum++;
			if(totalLoadItemNum==totalItemNum){
				$carousel.off('carousel-show',carouselFn)
			}
		}

	})
	*/
	var $carousel=$('.carousel-container');
	$carousel.item={};//0:loaded
	$carousel.totalItemNum=$carousel.find('.carousel-item').length;
	$carousel.totalLoadItemNum=0;
	$carousel.carouselFn=null;
	//开始加载
	$carousel.on('carousel-show',$carousel.carouselFn=function(err,index,elem){
		console.log('will trigger...')		
		if($carousel.item[index]!='loaded'){
			$carousel.trigger('carousel-load',[index,elem]);
		};
	});
	//执行加载
	$carousel.on('carousel-load',function(err,index,elem){
		var $img=$(elem).find('img');
		var imgUrl=$img.data('src');
		console.log('will load image..')
		loadImage(imgUrl,function(imgUrl){
			$img.attr('src',imgUrl);
		},function(imgUrl){
			$img.attr('src','images/focus-carousel/placeholder.png');
		});	
		$carousel.item[index]='loaded';
		$carousel.totalLoadItemNum++;
		if($carousel.totalLoadItemNum==$carousel.totalItemNum){
			$carousel.trigger('carousel-loaded');
		}
	});
	//结束加载
	$carousel.on('carousel-loaded',function(){
		$carousel.off('carousel-show',$carousel.carouselFn);
	});
	$carousel.carousel();

	/*下方的轮播图*/
	var $todaysCarousel=$('.todays .carousel-wrap');
	$todaysCarousel.item={};//0:loaded
	$todaysCarousel.totalItemNum=$todaysCarousel.find('.carousel-item img').length;
	$todaysCarousel.totalLoadItemNum=0;
	$todaysCarousel.carouselFn=null;
	//开始加载
	$todaysCarousel.on('carousel-show',$todaysCarousel.carouselFn=function(err,index,elem){
		console.log('will trigger...')		
		if($todaysCarousel.item[index]!='loaded'){
			$todaysCarousel.trigger('carousel-load',[index,elem]);
		};
	});
	//执行加载
	$todaysCarousel.on('carousel-load',function(err,index,elem){
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
			$todaysCarousel.item[index]='loaded';
			$todaysCarousel.totalLoadItemNum++;
			if($todaysCarousel.totalLoadItemNum==$todaysCarousel.totalItemNum){
				$todaysCarousel.trigger('carousel-loaded');
			}						
		});		
	});
	//结束加载
	$todaysCarousel.on('carousel-loaded',function(){
		$todaysCarousel.off('carousel-show',$todaysCarousel.carouselFn);
	});
	$todaysCarousel.carousel();
})(jQuery);