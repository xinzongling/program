;(function($){
	function Tab($elem,options){
		this.$elem=$elem;
		this.$tabItems=this.$elem.find('.tab-item');
		this.$tabPanels=this.$elem.find('.tab-panel');
		this.options=options;
		this.now=this.options.activeIndex;
		this.timer=null;
		this.init();
	};
	Tab.prototype={
		constructor:Tab,
		init:function(){
			var _self=this;
			//1,初始化
			this.$tabItems.eq(this.now).addClass('tab-active');
			this.$tabPanels.eq(this.now).show();
			//2，初始化显示隐藏插件
			this.$tabPanels.showHide(this.options);
			
			this.$elem.trigger('tab-show',[this.now,this.$tabPanels[this.now]]);
			
			this.$tabPanels.on('show',function(ev){
				_self.$elem.trigger('tab-show',[_self.$tabPanels.index(this),this]);
			})
			//3,监听事件
			var eventName=null;
			if(this.options.eventName=='click'){
				eventName='click';
			}else{
				eventName='mouseenter';
			};

			this.$elem.on(eventName,'.tab-item',function(){
				_self.toggle($(this).index())
			})
			//轮播图的自动播放
			if(this.options.autoPlay){
				this.autoPlay();
				this.$elem.hover(this.pause.bind(this),this.autoPlay.bind(this))					
			}			
		},
		getCorrectIndex:function(index){
			if(index>this.$tabItems.length-1){
				index=0;
			};
			if(index<0){
				index=this.$tabItems.length-1;
			};
			return index;
		},
		toggle:function(index){
			//index,即将要显示的，this.now ,目前显示的
			if(this.now==index) return;

			this.$tabItems.eq(index).addClass('tab-active');
			this.$tabItems.eq(this.now).removeClass('tab-active');
			
			this.$tabPanels.eq(this.now).showHide('hide');
			this.$tabPanels.eq(index).showHide('show');
			this.now=index;
		},
		autoPlay:function(){
			this.timer=setInterval(function(){
				this.toggle(this.getCorrectIndex(this.now+1));
			}.bind(this),this.options.autoPlayTime);
		},
		pause:function(){
			clearInterval(this.timer);
		}
	};
	Tab.DEFAULTS={
		js:false,
		mode:'fade',
		activeIndex:1,
		eventName:'mouseenter',
		autoPlay:false,
		autoPlayTime:1000
	};
	$.fn.extend({
		tab:function(options){
			this.each(function(){
				var $this=$(this);		
				var tab=$this.data('tab');
				if(!tab){//单例
					options=$.extend(Tab.DEFAULTS,options);
					tab=new Tab($this,options);
					$this.data('tab',tab);
				}//暴露内部方法
				if(typeof tab[options] == 'function'){
					tab[options]($this); 
				}
			});
			return this;
		}
	});
})(jQuery)