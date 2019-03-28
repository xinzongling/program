;(function($){
	function Dropdown($elem,options){
		//罗列属性
		this.$elem=$elem;
		this.options=options;
		
		this.layer=this.$elem.find('.dropdown-layer');
		this.timer=null;
		this.init();//注意：先罗列属性值，再初始化
		//绑定事件
		if(this.options.eventName == 'click'){
			this.$elem.on('click',function(ev){
				ev.stopPropagation();
				this.show();
			}.bind(this));
			$(document).on('click',this.hide.bind(this));
		}else{
			this.$elem.hover(this.show.bind(this),this.hide.bind(this));
		}
	};
	Dropdown.prototype={
		constructor:Dropdown,
		init:function(){
			this.activeClass=this.$elem.data('active')+'-active';
			//初始化隐藏和显示
			this.layer.showHide(this.options);
		},
		show:function(){
			if(this.options.delay){
				this.timer=setTimeout(function(){
					this.layer.showHide('show');
					this.$elem.addClass(this.activeClass);
				}.bind(this),this.options.delay);
			}			
		},
		hide:function(){
			clearTimeout(this.timer);
			this.layer.showHide('hide');
			this.$elem.removeClass(this.activeClass);
		}
	};
	Dropdown.DEFAULTS={
		js:true,
		mode:'fadeSlideUpDown',
		delay:500,
		eventName:'hover'
	};
	$.fn.extend({
		dropdown:function(options){
			this.each(function(){
				var $elem=$(this);			
				var mode=$elem.data('mode');
				if(!mode){//单例
					options=$.extend(Dropdown.DEFAULTS,options);
					mode=new Dropdown($elem,options);
					$elem.data('mode',mode);
				}//暴露内部方法
				if(typeof mode[options] == 'function'){
					mode[options]($elem); 
				}
			});
			return this;
		}
	});
})(jQuery)