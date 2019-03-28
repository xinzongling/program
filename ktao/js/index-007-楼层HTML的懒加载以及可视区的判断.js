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

	//获取数据
	function getDataOnce($elem,url,callback){
		var data=$elem.data(url);
		if(!data){
			$.getJSON(url,function(resData){
				$elem.data(url,resData);
				callback(resData);
			});
		}else{
			callback(data);
		};

	}
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
	var $floor=$('.floor');
	/*楼层图片的懒加载*/
	function floorImgLazyLoad($elem){
		$elem.item={};//0:loaded
		$elem.totalItemNum=$elem.find('.floor-item img').length;
		$elem.totalLoadItemNum=0;
		$elem.floorFn=null;
		//开始加载
		$elem.on('tab-show',$elem.floorFn=function(err,index,elem){	
			if($elem.item[index]!='loaded'){
				$elem.trigger('floorImg-load',[index,elem]);
			};
		});
		//执行加载
		$elem.on('floorImg-load',function(err,index,elem){
			var $imgs=$(elem).find('.floor-item .floor-img');
			console.log($imgs)		
			$imgs.each(function(){
				console.log('kkkk')
				var $img=$(this);
				var imgUrl=$img.data('src');
				console.log('will load image imgUrl..',imgUrl)
				loadImage(imgUrl,function(imgUrl){
					$img.attr('src',imgUrl);
				},function(imgUrl){
					$img.attr('src','images/floor/placeholder.png');
				});	
				$elem.item[index]='loaded';
				$elem.totalLoadItemNum++;
				if($elem.totalLoadItemNum==$elem.totalItemNum){
					$elem.trigger('floorImg-loaded');
				}				
			});	
		});
		//结束加载
		$elem.on('floorImg-loaded',function(){
			$elem.off('tab-show',$elem.floorFn);
		});	
	};
	/*
	$floor.each(function(){
		floorImgLazyLoad($(this));
	})*/
		//可视区的判断
		function isVisiable($elem){
			return ($win.scrollTop()+$win.height()>$elem.offset().top)&&
			($win.scrollTop()<$elem.offset().top+$elem.height());
		};
		var $floor=$('.floor');
		var $win=$(window);
		var $doc=$(document);
		//创建HTML;
		function buildFloorHtml(oneFloorData){
			var html='';
			html+='<div class="container">';
			html+=buildFloorHeadHtml(oneFloorData);
			html+=buildFloorBodyHtml(oneFloorData);
			html+='</div>';
			return html;
		};
		function buildFloorHeadHtml(oneFloorData){
			var html='';
			html+=	'<div class="floor-hd">';
			html+=	'	<div class="floor-title">';
			html+=	'		<div class="floor-title-num">'+oneFloorData.num+'F</div>';
			html+=	'		<div class="floor-title-text">'+oneFloorData.text+'</div>';
			html+=	'	</div>';
			html+=	'	<ul class="tab">';
			for(var i=0;i<oneFloorData.tabs.length;i++){
				html+='<li class="tab-item "><a href="#">'+oneFloorData.tabs[i]+'</a></li>';
			}
			html+=	'	</ul>';
			html+=	'</div>';	
			return html;
		};		
		function buildFloorBodyHtml(oneFloorData){
			var html='';
			html+='<div class="bd">';
			for(var i=0;i<oneFloorData.items.length;i++){
				html+='<ul class="tab-panel clearfix">';
				for(var j=0;j<oneFloorData.items[i].length;j++){
					html+='<li class="floor-item">';
					html+='		<p class="floor-item-img">';
					html+='			<a href="#">';
					html+='				<img class="floor-img" src="images/floor/loading.gif" data-src="images/floor/'+oneFloorData.num+'/'+(i+1)+'/'+(j+1)+'.png" alt="">';
					html+='			</a>';
					html+='		</p>';
					html+='		<p class="floor-item-name">';
					html+='			<a href="#">'+oneFloorData.items[i][j].name+'</a>';
					html+='		</p>';
					html+='		<p class="floor-item-price">￥'+oneFloorData.items[i][j].price+'</p>';
					html+='</li>';
				}
				html+='</ul>';
			}
			html+='</div>';
			return html;
		};	
		/*楼层HTML的懒加载*/		
		function floorHtmlLazyLoad(){
			var item={};//0:loaded
			var totalItemNum=$floor.length;
			var totalLoadItemNum=0;
			var floorFn=null;
			//开始加载
			$doc.on('floorHTML-show',floorFn=function(err,index,elem){	
				if(item[index]!='loaded'){
					$doc.trigger('floorHTML-load',[index,elem]);
				};
			});
			//执行加载
			$doc.on('floorHTML-load',function(err,index,elem){
					//加载HTML
					//1,生成html。
					getDataOnce($doc,'data/floor/floorData.json',function(data){
						var html=buildFloorHtml(data[index]);
						//2,加载HTML。
						$(elem).html(html);
						//3,图片的懒加载。
						floorImgLazyLoad($(elem));
						//4,激活选项卡。
						$(elem).tab()
					});					
					item[index]='loaded';
					totalLoadItemNum++;
					if(totalLoadItemNum==totalItemNum){
						$doc.trigger('floorHTML-loaded');
					}											
			});
			//结束加载
			$doc.on('floorHTML-loaded',function(){
				$doc.off('floorHTML-show',floorFn);
			});
		};
		floorHtmlLazyLoad();
	function timeToShow(){
		$floor.each(function(index,elem){
		//index,每个Floor对应的索引，elem：每个floor的DOM节点。
			if(isVisiable($(elem))){
				$doc.trigger('floorHTML-show',[index,elem]);
			};
		});	
	};
	$win.on('scroll resize load',function(){
		clearTimeout($floor.floorShowTimer);
		$floor.floorShowTimer=setTimeout(timeToShow,200)
	});
	//$floor.tab();
})(jQuery);