;(function($){
	//数据的缓存
	var cache={
		data:{},
		count:0,
		addData:function(key,value){
			this.data[key]=value,
			this.count++;
		},
		readData:function(key){
			return this.data[key];
		}
	}
	function Search($elem,options){
		//罗列属性
		this.$elem=$elem;
		this.options=options;
		this.$searchForm=this.$elem.find('.search-form');	
		this.$searchInput=this.$elem.find('.search-input');	
		this.$searchLayer=this.$elem.find('.search-layer');
		this.$searchBtn=this.$elem.find('.search-btn');
		/*this.timer=null;*/
		this.isLoaded=false;
		this.init();//注意：先罗列属性值，再初始化

		if(this.options.autoComplete){
			this.autoComplete();
		}
	};
	Search.prototype={
		constructor:Search,
		init:function(){
			//提交
			this.$searchBtn.on('click',this.submit.bind(this));			
		},
		submit:function(){
			if(this.getInputVal()==''){
				return false;
			}
			this.$searchForm.trigger('submit');
		},
		getInputVal:function(){
			return $.trim(this.$searchInput.val());
		},
		autoComplete:function(){			
			this.$searchInput
			.on('input',function(){
				if(this.options.getDataInterval){
					clearTimeout(this.timer);
					this.timer=setTimeout(function(){
						this.getData();
					}.bind(this),this.options.getDataInterval)
				}else{
					this.getData();
				}
			}.bind(this))
			.on('focus',this.showLayer.bind(this))
			.on('click',function(ev){
				ev.stopPropagation();
			});
			$(document).on('click',function(){
			//注意,当在document添加点击事件时，一定要注意ducument下边的元素的冒泡
				this.hideLayer()
			}.bind(this));

			//初始化显示
			this.$searchLayer.showHide(this.options);
		},
		getData:function(){
			var inputVal = this.getInputVal();

			if(inputVal == ''){
				this.$searchLayer.showHide('hide');
				return false;
			}
			if(cache.readData(this.getInputVal())){
				this.$elem.trigger('getData',[cache.readData(inputVal)]);
				return;
			}
			console.log('get data...')
			if(this.jqXHR){//由于定时器的延时,所以为了拿到最新的数据，需要再次判断
				this.jqXHR.abort();
			};
				console.log('get data next...')
			this.jqXHR=$.ajax({
				url:this.options.url+this.getInputVal(),
				dataType:'jsonp',
				jsonp:'callback'
			})
			.done(function(data){
				//存储数据到缓存之中
				cache.addData(this.getInputVal(),data);
				this.$elem.trigger('getData',[data]);
			}.bind(this))
			.fail(function(err){
					this.$elem.trigger('getNoData');
			}.bind(this))
			.always(function(){
				console.log('always...');
				this.jqXHR=null;
			}.bind(this));
		},
		appendHtml:function(html){
			console.log('html....');
			console.log('html....',html);
			this.$searchLayer.html(html);
			this.isLoaded=!!html;
		},
		showLayer:function(){
			if(!this.isLoaded) return;
			this.$searchLayer.showHide('show');
		},
		hideLayer:function(){
			this.$searchLayer.showHide('hide');
		},
		setInputVal:function(val){
			this.$searchInput.val(removeHTMLTag(val));
			function removeHTMLTag(str){
				return str.replace(/<[^<|>]+>/g,'');
			};
		}
	};
	Search.DEFAULTS={
		autoComplete:true,
		js:true,
		mode:'slideUpDown',
		getDataInterval:200,
		url:'https://suggest.taobao.com/sug?code=utf-8&_ksTS=1551435386758_2851&callback=jsonp2852&k=1&area=c2c&bucketid=6&q='
	};
	$.fn.extend({
		search:function(options,val){
			console.log(val)
			this.each(function(){
				var $elem=$(this);			
				var search=$elem.data('search');
				if(!search){//单例
					options=$.extend(Search.DEFAULTS,options);
					search=new Search($elem,options);
					$elem.data('search',search);
				}//暴露内部方法
				if(typeof search[options] == 'function'){
					search[options](val); 
				}
			});
			return this;
		}
	});
})(jQuery)