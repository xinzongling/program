(function($){
	function getRandom(min,max){
		return Math.round(min+(max-min)*Math.random());
	};
	/*
			var $wall=$('.wall');
		var $wish=$('.wish');	
		var $wallWidth=$('.wall').width();
		var $wishWidth=$('.wish').width();
		var $wallHeight=$('.wall').height();
		var $wishHeight=$('.wish').height();
		$($wish).pep({
		  constrainTo: '.wall'
		});

		$wish.each(function(){
			var x=getRandom(0,$wallWidth-$wishWidth);
			var y=getRandom(0,$wallHeight-$wishHeight);
			$(this).css({
				transform:'matrix(1,0,0,1,'+x+','+y+')'
			});
		});
	*/	

		var $wall=$('.wall');
		var $wish=$('.wish');	
		var $wallWidth=$('.wall').width();
		var $wishWidth=$('.wish').width();
		var $wallHeight=$('.wall').height();
		var $wishHeight=$('.wish').height();
	function handleDrag($elem){ //拖拽

		$elem.pep({
		  constrainTo: '.wall'
		});

		$elem.each(function(){
			var x=getRandom(0,$wallWidth-$wishWidth);
			var y=getRandom(0,$wallHeight-$wishHeight);
			$(this).css({
				transform:'matrix(1,0,0,1,'+x+','+y+')'
			});
		});
	}
	handleDrag($wish);



	$('.sub-btn').on('click',function(){
		var value=$('#content').val();
		$.ajax({
			url:'/add',
			type:'POST',
			data:{
				content:value
			},
			dataType:'json'
		})
		.done(result=>{
			if(result.status==0){//成功
				//把拿到的数据渲染出来
				console.log('result.......',result)
				var $html=$(`<div class="wish" style="background:${result.data.color}"><a href="JavaScript:;" class="close" data-id="${result.data.id}"></a>${result.data.content}</div>`);
				$wall.append($html);
				handleDrag($html);//$html,jQuery对象
				$('#content').val('');
			}else{
				alert(result.message);
			};
		})
	});

	$wall.on('click','.close',function(){
		var self=this;
		$.ajax({
			url:'/del',
			data:'id='+$(this).data('id'),
			dataType:'json'
		})
		.done(function(result){
			if(result.status==0){//成功
				//移出点击的id的父节点
				console.log('this.parentNode',this.parentNode)
				$(self.parentNode).remove();
			}else{
				alert(result.message);
			};
		});
	});
})(jQuery);