;(function($){
	function Carousel($elem,options){
		this.$elem=$elem;
		this.$carouselItem=this.$elem.find('.carousel-item');
		this.$btns=this.$elem.find('.btns');
		this.$btnsItem=this.$elem.find('.btns-item');
		this.$controls=this.$elem.find('.control');
		this.options=options;
		this.now=this.options.defaultImg;
		this.timer=null;
		this.init();
	};
	Carousel.prototype={
		constructor:Carousel,
		init:function(){
			var _self=this;

			this.$elem.trigger('carousel-show',[this.now,this.$carouselItem[this.now]]);
			//圆的按钮添加class
			this.$btnsItem.eq(this.options.defaultImg).addClass('btns-active');
			//当鼠标放到轮播图上,显示左右按钮
			this.$elem.hover(this.showControl.bind(this),this.hideControl.bind(this));			
			if(this.options.slide){//滑动
				this.$elem.addClass('slide');
				//根据参数显示第几张图片
				this.$carouselItem.eq(this.options.defaultImg).css({left:0});

				this.$carouselItem.on('move',function(ev){
					if(_self.now!=$(this).index()){
						_self.$elem.trigger('carousel-show',[$(this).index(),this]);
					}
				});

				//获取轮播图的宽度
				this.$elemWidth=this.$elem.width();
				//初始化移动
				this.$carouselItem.move({Js:true});
				//给右边的按钮添加点击事件
				this.$controls.eq(1).on('click',function(ev){
					ev.stopPropagation();
					this.slide(this.now+1,1);//右击左滑，
				}.bind(this));
				//给左边的按钮添加点击事件
				this.$controls.eq(0).on('click',function(){
					this.slide(this.now-1,-1);//左击右滑
				}.bind(this));
				//给底部的按钮绑定事件代理
				this.$elem.on('click','.btns-item',function(){
					_self.slide($(this).index());
				});				
			}else{//淡入模式
				this.$elem.addClass('fade');
				//初始化显示隐藏图片
				this.$carouselItem.showHide(this.options);
				//根据参数显示第几张图片
				this.$carouselItem.eq(this.options.defaultImg).showHide('show');				
	
				this.$carouselItem.on('show',function(ev){
					_self.$elem.trigger('carousel-show',[$(this).index(),this]);
				})

				//给右边的按钮添加点击事件
				this.$controls.eq(1).on('click',function(ev){
					ev.stopPropagation();//需要阻止冒泡，防止冒泡到上级元素
					this.fade(this.now+1)//注意，函数里面不能用this.now++的形式
				}.bind(this));
				//给左边的按钮添加点击事件
				this.$controls.eq(0).on('click',function(){
					this.fade(this.now-1)//注意，函数里面不能用this.now++的形式
				}.bind(this));
				//给底部的按钮绑定事件代理
				this.$elem.on('click','.btns-item',function(){
					_self.tab($(this).index());
				});
			};
			//轮播图的自动播放
			if(this.options.autoPlay){
				this.autoPlay();
				this.$elem.hover(this.pause.bind(this),this.autoPlay.bind(this))					
			}			
		},
		showControl:function(){
			this.$controls.show();
		},
		hideControl:function(){
			this.$controls.hide();
		},
		slide:function(index,direction){
			index=this.getCorrectIndex(index);
			if(!direction){
				if(index>this.now){
					direction=1;
				}else{
					direction=-1;
				}				
			};
			if(this.now==index) return ;
			//index代表目标值，既将要滑动的索引，this.now代表目前的索引
			//把即将要划入的放到指定的位置，
			this.$carouselItem.eq(index).css({left:direction*(this.$elemWidth)});
			//把当前的划出
			this.$carouselItem.eq(this.now).move('x',-1*direction*(this.$elemWidth));
			//把指定位置的划入
			this.$carouselItem.eq(index).move('x',0);
			this.$btnsItem.eq(this.now).removeClass('btns-active');
			this.now=index;
			//圆的按钮添加class
			this.$btnsItem.eq(this.now).addClass('btns-active');
		},
		fade:function(index){
			index=this.getCorrectIndex(index);
			this.tab(index);
		},
		getCorrectIndex:function(index){
			if(index>this.$carouselItem.length-1){
				index=0;
			};
			if(index<0){
				index=this.$carouselItem.length-1;
			};
			return index;
		},
		tab:function(index){
			if(this.now==index) return ;
			this.$carouselItem.eq(this.now).showHide('hide');
			this.$carouselItem.eq(index).showHide('show');

			this.$btnsItem.eq(index).addClass('btns-active');
			this.$btnsItem.eq(this.now).removeClass('btns-active');
			this.now=index;
		},
		autoPlay:function(){
			this.timer=setInterval(function(){
				this.$controls.eq(1).trigger('click');
			}.bind(this),this.options.autoPlayTime);
		},
		pause:function(){
			clearInterval(this.timer);
		}
	};
	Carousel.DEFAULTS={
		js:true,
		mode:'fade',
		slide:true,
		defaultImg:0,
		autoPlay:false,
		autoPlayTime:1000
	};
	$.fn.extend({
		carousel:function(options){
			this.each(function(){
				var $this=$(this);		
				var carousel=$this.data('carousel');
				if(!carousel){//单例
					options=$.extend(Carousel.DEFAULTS,options);
					carousel=new Carousel($this,options);
					$this.data('carousel',carousel);
				}//暴露内部方法
				if(typeof carousel[options] == 'function'){
					carousel[options]($this); 
				}
			});
			return this;
		}
	});
})(jQuery)