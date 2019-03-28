;(function ($) {
	$('.dropdown').hover(function(){
		var $this=$(this);
		/*
		$this.addClass('menu-active')//注意：jQuery中的addClass，removeClass不需要打点
		*/
		/*
		var activeClass=$this.data('active')+'-active';
		$this.addClass(activeClass);
	},function(){
		var $this=$(this);*/
		/*
		$this.removeClass('menu-active')*/
		/*
		var activeClass=$this.data('active')+'-active';
		$this.removeClass(activeClass);*/
		$this.dropdown();
	});
})(jQuery);