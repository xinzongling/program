;(function($){
	function init($elem){
		this.$elem=$elem;
		this.$elem.removeClass('transition');
		this.$elemLeft=parseFloat(this.$elem.css('left'));
		this.$elemTop=parseFloat(this.$elem.css('top'));
	};
	function to(x,y,callBack){
		if(this.$elemLeft==x&&this.$elemTop==y) return;
		if(x&&!y){
			y==this.$elemTop;
		};
		if(!x&&y){
			x==this.$elemLeft;
		};
		callBack();
		this.$elemLeft=x;
		this.$elemTop=y;
	};	
	function Slient($elem){
		init.call(this,$elem);
	};
	Slient.prototype={
		constructor:Slient,
		to:function(x,y){
			to.call(this,x,y,function(){
				this.$elem.trigger('move');
				this.$elem.css({
					left:x,
					top:y
				});
				this.$elem.trigger('moved');				
			}.bind(this));
		},
		x:function(x){
			this.to(x);
		},
		y:function(y){
			this.to(null,y);
		}
	};
	function Js($elem){
		init.call(this,$elem);
	};
	Js.prototype={
		constructor:Js,
		to:function(x,y){
			to.call(this,x,y,function(){
				this.$elem.trigger('move');
				this.$elem.stop().animate({
					left:x,
					top:y
				});
				this.$elem.trigger('moved');				
			}.bind(this));
		},
		x:function(x){
			this.to(x);
		},
		y:function(y){
			this.to(null,y);
		}
	};
	var DEFAULTS = {
		Js:false
	};
	function getMove($elem,options){
		console.log('move........')
		var moveFn=null;
		if(options.Js){
			moveFn=new Js($elem);
		}else{
			moveFn=new Slient($elem);
		};
		return {
			to:moveFn.to.bind(moveFn),//注意this,this指向new出来的对象,moveFn
			x:moveFn.x.bind(moveFn),
			y:moveFn.y.bind(moveFn),
		};
	}
	$.fn.extend({
		move:function(options,x,y){
			return this.each(function(){
				var $this = $(this);
				var move = $this.data('move');
				if(!move){//单例模式
					options  = $.extend(DEFAULTS,options);
					move=getMove($this,options);
					$this.data('move',move);
				}
				if(typeof move[options] == 'function'){
					move[options](x,y);
				}
			});
		}
	})
})(jQuery)
