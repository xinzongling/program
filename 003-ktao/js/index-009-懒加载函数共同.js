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

	};
	//懒加载共同
	function lazyLoad(options){
		var item={},
			totalItemNum=options.totalItemNum,
			totalLoadItemNum=0,
			loadFn=null,
			$elem=options.$elem,
			eventName=options.eventName,
			eventPerfix=options.eventPerfix;
		//开始加载
		$elem.on(eventName,loadFn=function(err,index,elem){
			if(item[index]!='loaded'){
				$elem.trigger(eventPerfix+'-load',[index,elem,function(){
					item[index]='loaded';
					totalLoadItemNum++;
					if(totalLoadItemNum==totalItemNum){
						$elem.trigger(eventPerfix+'-loaded');
					};
				}]);
			};
		});
		//结束加载
		$elem.on(eventPerfix+'-loaded',function(){
			$elem.off(eventName,loadFn);
		});		
	};
	//下拉菜单
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
	lazyLoad({
			totalItemNum:$carousel.find('.carousel-item img').length,
			$elem:$carousel,
			eventName:'carousel-show',
			eventPerfix:'carousel'
	});
		$carousel.on('carousel-load',function(err,index,elem,fn){
			var $imgs=$(elem).find('img');
			$imgs.each(function(){
				var $img=$(this);
				var imgUrl=$img.data('src');
				loadImage(imgUrl,function(imgUrl){
					$img.attr('src',imgUrl);
				},function(imgUrl){
					$img.attr('src','images/focus-carousel/placeholder.png');
				});							
			});
			fn();		
		});

	$carousel.carousel();
	/*下方的轮播图*/
	var $todaysCarousel=$('.todays .carousel-wrap');	
	lazyLoad({
			totalItemNum:$todaysCarousel.find('.carousel-item img').length,
			$elem:$todaysCarousel,
			eventName:'carousel-show',
			eventPerfix:'carousel'
	});
		$todaysCarousel.on('carousel-load',function(err,index,elem,fn){
			var $imgs=$(elem).find('img');
			$imgs.each(function(){
				var $img=$(this);
				var imgUrl=$img.data('src');
				loadImage(imgUrl,function(imgUrl){
					$img.attr('src',imgUrl);
				},function(imgUrl){
					$img.attr('src','images/focus-carousel/placeholder.png');
				});							
			});
			fn();		
		});
	$todaysCarousel.carousel();
	/*楼层*/
	var $floor=$('.floor');
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
		$floor.on('tab-load',function(err,index,elem,fn){
			var $imgs=$(elem).find('.floor-item .floor-img');	
			$imgs.each(function(){
				var $img=$(this);
				var imgUrl=$img.data('src');
				loadImage(imgUrl,function(imgUrl){
					$img.attr('src',imgUrl);
				},function(imgUrl){
					$img.attr('src','images/floor/placeholder.png');
				});	
				fn();			
			});	
		});
		$doc.on('floor-load',function(ev,index,elem,fn){
			//加载HTML
			//1,生成html。
			getDataOnce($doc,'data/floor/floorData.json',function(data){
				var html=buildFloorHtml(data[index]);				
				$(elem).html(html);	//2,加载HTML。			
				lazyLoad({	//3,图片的懒加载。
					totalItemNum:$(elem).find('.floor-item img').length,
					$elem:$(elem),
					eventName:'tab-show',
					eventPerfix:'tab'							
				})				
				$(elem).tab()//4,激活选项卡。
			});					
			fn();											
		});
		$doc.on('floor-loaded',function(){
			$win.off('scroll resize load',$floor.showFloorFn);
		});
		lazyLoad({
			totalItemNum:$floor.length,
			$elem:$doc,
			//注意，在document上定义和触发事件时，一定要防止事件的冒泡
			eventName:'floorHTML-show',
			eventPerfix:'floor'	
		});
	function timeToShow(){
		console.log('timeout show..')
		$floor.each(function(index,elem){
		//index,每个Floor对应的索引，elem：每个floor的DOM节点。
			if(isVisiable($(elem))){
				$doc.trigger('floorHTML-show',[index,elem]);
			};
		});	
	};
	$win.on('scroll resize load',$floor.showFloorFn=function(){
		clearTimeout($floor.floorShowTimer);
		$floor.floorShowTimer=setTimeout(timeToShow,200)
	});

	//电梯
	//获取电梯号
	function getFloorNum(){ //下一个楼层楼出头，则上一个楼层显示
		var num=-1;
		$('.floor').each(function(index,elem){
			num=index;
			if($(elem).offset().top>$win.scrollTop()+$win.height()/2){
				num=index-1;
				return false; //退出循环
			}
		});
		return num;
	};
	//设置电梯
	var $elevator=$('.elevator');
	var $elevatorItems=$('.elevator').find('.elevator-item');
	function setElevator(){
		var num=getFloorNum();
		if(num==-1){
			$elevator.fadeOut();
		}else{
			$elevator.fadeIn();
			$elevatorItems.removeClass('elevator-active');
			$elevatorItems.eq(num).addClass('elevator-active');
		}
	};
	$win.on('scroll resize load',function(){
		clearTimeout($elevator.showElevatorTimer);
		$elevator.showElevatorTimer=setTimeout(setElevator,200)
	});
	//点击到达某一楼层
	$elevator.on('click','.elevator-item',function(){
		var num=$elevatorItems.index(this);
		$('html,body')
		.animate({
			scrollTop:$floor.eq(num).offset().top
		})
	})

	//工具条，回到顶部
	$('#backToTop').on('click',function(){
		$('html,body')
		.animate({
			scrollTop:0
		})
	})
})(jQuery);