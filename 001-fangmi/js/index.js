
handleCart();
handleNav();
handleCate();
handleCountTime();
handleFlashProduct();
handleOptions();
function handleCart(){
	var oCart=document.querySelector('.top .cart');
	var cartLink=document.querySelector('.top .cart .cart-box a');
	var oCartbox=document.querySelector('.top .cart .cart-box');
	var oCartContent=document.querySelector('.top .cart .cart-content');
	var oLoader=oCartContent.querySelector('.top .cart .cart-content .loader');
	var oEmptyCart=oCartContent.querySelector('.top .cart .cart-content .empty-cart');
	oCart.onmouseenter=function(){
		//先改变字体颜色和背景色
		oCartbox.style.background='#fff';
		cartLink.style.color="red";
		//加载loading图标，此时浏览器正在向后台请求数据
		oLoader.style.display='block';
		//显示购物车内容
		animation(oCartContent,{height:100},true,function(){
			oLoader.style.display='none';
			//此出会根据请求结果显示
			oEmptyCart.style.display='block';
		})
	}
	oCart.onmouseleave=function(){
		oCartbox.style.background='#424242';
		cartLink.style.color="#b0b0b0";
		//隐藏购物车内容
		animation(oCartContent,{height:0},true,function(){
			//隐藏购物车数据和loading图片
			oLoader.style.display='none';
			oEmptyCart.style.display='none';
		})
	}
}

function handleNav(){
	var navLi=document.querySelectorAll('.header .nav ul li');
	var	oNavContent=document.querySelector('.header .header-content');
	var oNavContentContainer=document.querySelector('.header .header-content .container');
	var hideTimer=0;
	var hideDataTimer=0;
	for(var i=0;i<navLi.length-2;i++){
		navLi[i].index=i;
		//鼠标移入
		navLi[i].onmouseenter=function(){
			clearTimeout(hideTimer);
			oNavContent.style.borderTop="1px solid #ccc";
			oNavContentContainer.innerHTML='<div class="loader"></div>';
			animation(oNavContent,{height:240},true,function(){
				oNavContent.style.overflow='visible';
			});
			var index=this.index;
			clearTimeout(hideDataTimer);
			hideDataTimer=setTimeout(function(){
				loadData(index);
			},300);
		}
		//鼠标移出
		navLi[i].onmouseleave=function(){
			hideNavContent();
		}
	}
	oNavContent.onmouseenter=function(){
		clearTimeout(hideTimer);
	}
	oNavContent.onmouseleave=function(){
		hideNavContent();
	}
	function hideNavContent(){
		hideTimer=setTimeout(function(){
				oNavContent.style.overflow='hidden';
				animation(oNavContent,{height:0},true,function(){
				oNavContent.style.borderTop="none";
			})
		},300);
	}
	function loadData(index){
		var data=aNavItemData[index];
		var html='<ul>';
			for(var i=0;i<data.length;i++){
				html+='<li>';
				html+=	'<div class="img-box">';
				html+=		'<a href="'+data[i].url+'">';
				html+=			'<img src="'+data[i].img+'" alt="">';
				html+=		'</a>';
				html+=	'</div>';
				html+='<p class="product-name">'+data[i].name+'</p>';
				html+='<p class="price">'+data[i].price+'</p>';
				if(data[i].tag){
					html+='<span class="tag">'+data[i].tag+'</span>';
				}
				html+='</li>'
			}		
		html+='</ul>';
		oNavContentContainer.innerHTML=html;
	}
}
	
	function carousel(option){
		//1,罗列属性
		this.oBox=document.getElementById(option.id);
		this.oUl=null;
		this.aImg=option.aImg;
		this.width=option.width;
		this.height=option.height;
		this.leftBtn=null;
		this.rightBtn=null;
		this.now=0;
		this.oBottomBtn=null;
		this.playDuration=option.playDuration;
		//2，初始化
		this.init();
		//3，绑定事件
		this.bindEvent();
		this.tab();
		if(this.playDuration){
			this.autoPlay();
		}
	}
	carousel.prototype.init=function(){
		this.oUl=document.createElement('ul');
		this.oBox.appendChild(this.oUl);
		this.oBox.style.position='relative';
		this.oBox.style.height=this.height+'px';
		this.oBox.style.width=this.width+'px';
		//li和img
		for(var i=0;i<this.aImg.length;i++){
			var oLi=document.createElement('li');			
			var oImg=document.createElement('img');
			oImg.src=this.aImg[i];		
			oImg.style.position='absolute';
			oImg.style.left=0;
			oImg.style.top=0;
			//默认显示第一张
			if(i==1){
				oLi.style.zIndex=50;
				oLi.style.opacity=1;
			}else{
				oLi.style.zIndex=0;
				oLi.style.opacity=0;
			}
			oImg.style.width=this.width+'px';
			oImg.style.height=this.height+'px';
			oLi.appendChild(oImg);
			this.oUl.appendChild(oLi);
		}
		//左右按钮
		this.leftBtn=document.createElement('span');
		this.rightBtn=document.createElement('span');
		this.oBox.appendChild(this.leftBtn);
		this.oBox.appendChild(this.rightBtn);
		this.leftBtn.className='leftBtn';
		this.rightBtn.className='rightBtn';
		this.leftBtn.innerHTML='&lt;';
		this.rightBtn.innerHTML='&gt;';
		//创建底部的按钮
		this.oBottomBtn=document.createElement('ul');
		this.oBox.appendChild(this.oBottomBtn);
		this.oBottomBtn.className='oBottomBtn';
		this.oBottomBtn.style.marginLeft=this.oBottomBtn.offsetWidth*0.5+'px';
		for(var i=0;i<this.aImg.length;i++){
			var oLi=document.createElement('li');
			if(i==0){
				oLi.className='active';
			}
			this.oBottomBtn.appendChild(oLi);	
		}
	}
	carousel.prototype.bindEvent=function(){
		//右边的按钮
		this.rightBtn.onclick=function(){
			this.now++;
			if(this.now>=this.aImg.length){
				this.now=0;
			};
			this.tab();
		}.bind(this);
		//左边的按钮
		this.leftBtn.onclick=function(){
			this.now--;
			if(this.now<0){
				this.now=this.aImg.length-1;
			};
			this.tab();
		}.bind(this);
		//底部按钮
		var _self=this;
		for(var i=0;i<this.aImg.length;i++){
			this.oBottomBtn.children[i].index=i;
			this.oBottomBtn.children[i].onclick=function(){
				_self.now=this.index;
				_self.tab();
			};
		}
	}
	carousel.prototype.autoPlay=function(){
		var timer=setInterval(this.rightBtn.onclick,
		this.playDuration);
		this.oBox.onmouseover=function(){
			clearInterval(timer);
		};
		this.oBox.onmouseout=function(){
			timer=setInterval(this.rightBtn.onclick,
			this.playDuration);
		}.bind(this);
	}
	carousel.prototype.tab=function(){
			for(var i=0;i<this.aImg.length;i++){
				this.oUl.children[i].style.zIndex=0;
				this.oUl.children[i].style.opacity=0;
				this.oBottomBtn.children[i].className='';
			}
			this.oUl.children[this.now].style.zIndex=50;
			/*this.oUl.children[this.now].style.opacity=1;*/
			this.oBottomBtn.children[this.now].className='active';
			animation(this.oUl.children[this.now],{opacity:100},false);
	}
	handle();   /*new 对象一定要放到构造函数的后面。否则会出现错误，(this.init)。也就是说构造函数不会有声明的提升*/
	function handle(){
		new carousel({id:'carousel',
					aImg:['images/carousel/1.jpg','images/carousel/2.jpg',
					'images/carousel/3.jpg','images/carousel/4.jpg','images/carousel/5.jpg'],
					width:1224,
					height:460,
					playDuration:3000
		})	
	}

	
	function handleCate(){
		var oCateLi=document.querySelectorAll('.home .carousel .carousel-left li');
		var oCateContent=document.querySelector('.home .carousel .cate-content');
		var oCartbox=document.querySelector('.home .carousel .cate-box')
		for(var i=0;i<oCateLi.length;i++){
			oCateLi[i].index=i;
			oCateLi[i].onmouseenter=function(){
				for(var j=0;j<oCateLi.length;j++){
					oCateLi[j].className='active0';
				}
				oCateContent.style.display='block';
				this.className='active1';
				loadData1(this.index);
			}
		}
		oCartbox.onmouseleave=function(){
			oCateContent.style.display='none';
			for(var j=0;j<oCateLi.length;j++){
					oCateLi[j].className='active0';
				}
		}
		function loadData1(index){
			var data =cateData[index];
			var html='<ul>';
			for(var i=0;i<data.length;i++){
				 html+='<li>'
				 html+=	'<a href="'+data[i].url+'">'
				 html+=		'<img src="'+data[i].img+'" alt="">'
				 html+=		'<span class="name">'+data[i].name+'</span>'
				 html+=	'</a>'
				 html+='</li>'
			}
			html+='</ul>';	
			oCateContent.innerHTML=html;		
		}
	}
/*倒计时处理*/
function handleCountTime(){
	var oTimerNum=document.querySelectorAll('.flash .timer-num');
	var timer=0;
	var endDate=new Date('2018-12-29 20:14:59');
	var endTime=endDate.getTime();
	function to2Str(num){
		return num>=10? num : '0'+num;
	}
	function handleTime(){
		var allMinuteSecond=endTime-new Date();
		if(allMinuteSecond<0){
			allMinuteSecond=0;
			clearInterval(timer);
		}
		var allSeconds=parseInt(allMinuteSecond/1000);
		var iHour=parseInt(allSeconds/3600);
		var iMinute=parseInt(allSeconds%3600/60);
		var iSecond=allSeconds%3600%60;
		oTimerNum[0].innerHTML=to2Str(iHour);
		oTimerNum[1].innerHTML=to2Str(iMinute);
		oTimerNum[2].innerHTML=to2Str(iSecond);
	}
	handleTime()
	timer=setInterval(handleTime,1000)
}
/*处理flash中商品的切换*/
function handleFlashProduct(){
	var oCtrl1=document.querySelector('.flash .hd .ctrl1');
	var oCtrl2=document.querySelector('.flash .hd .ctrl2');
	var oProduct=document.querySelector('.flash .col2 .product-list');
	oCtrl1.onclick=function(){
		oProduct.style.marginLeft='0px';
	};
	oCtrl2.onclick=function(){
		oProduct.style.marginLeft='-992px';
	}
}
//处理选项卡
function handleOptions(){
	var oOption=document.querySelectorAll('.elect .hd ul li a');/*querySelectorAll表示所有，querySelector表示单独一个*/
	var oOptionContent=document.querySelector('.elect .product .col2');
	loadData(0);
	oOption[0].className='active';
	for (var i=0;i<oOption.length;i++) {
		oOption[i].index=i;
		oOption[i].onmouseenter=function(){
			for(var j=0;j<oOption.length;j++){
				oOption[j].className='';
			}
			this.className='active';
			loadData(this.index)
		}
	}
	function loadData(index){
		var data=optionData[index];
		var html='<ul>';
		for(var i=0;i<data.length-1;i++){
			html+='<li class="pro">';
			html+=  	'<a href="'+data[i].url+'">';
			html+=          '<img src="'+data[i].img+'" alt=""></a>';
			html+=		'<p class="name">'+data[i].name+'</p>';
			html+=		'<p class="des">'+data[i].des+'</p>';
			html+=		'<p class="price"><strong>'+data[i].price+'</strong><del>'+data[i].del+'</del></p>';
			if(data[i].tag){
				html+=		'<div class="'+data[i].tag.tagName+'">'+data[i].tag.price+'</div>';
			};
			if(data[i].animation){
				html+= '<div class="animation"><p>'+data[i].animation.recommend+'</p><p>来自于'+data[i].animation.author+'的评价</p></div>'
			}
			html+='</li>';
		}
		var lastLi=data[data.length-1];
			html+='	<li>';
			html+='		<div class="top">';
			html+='			<a href="'+lastLi.top.url+'"><img src="'+lastLi.top.img+'" alt=""></a>';
			html+='			<a href="'+lastLi.top.url+'"><p class="name">'+lastLi.top.name+'</p></a>';
			html+='			<p class="price">'+lastLi.top.price+'</p>';
			html+='		</div>';
			html+='		<div class="bottom">';
			html+='			<a href="#">';
			html+='			<p class="name">浏览更多</p>';
			html+='			<p class="des">'+lastLi.bottom.name+'</p>';
			html+='			<i class="fas fa-arrow-circle-right"></i>';
			html+='			</a>';
			html+='		</div>';
			html+='</li>';
		html+='</ul>';
		oOptionContent.innerHTML=html;
	}
}