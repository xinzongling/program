//默认的是减速动画
			//减速动画与匀速动画的不同
			//1，速度的不同
			//2，结束定时器的条件的不同
			//3，匀速动画关闭定时器后还有一步到位。
			//链式动画：先改变一个属性，等到这个属性改变完后再改变另外一个属性。
			//链式动画：通过向函数里面再传一个函数，即把函数作为函数的参数。
			function animation(obj,option,isLinear,fn){
				    clearInterval(obj.timer);
				    //都执行完了，结束动画
				    //如果有没有执行完的，不结束
				    obj.timer=setInterval(function(){
				    	 var isStopAll=true;
				    for(attr in option){                     //迭代option里面的属性
						var curr=parseFloat(getComputedStyle(obj,false)[attr]);
						var speed=0;
						var isStop=false;   //单个属性的结束
						if(attr=='opacity'){
							curr=Math.round(curr*100);	
						}

						if(isLinear){
							if(curr<option[attr]){
					        speed=30;}
					        else{
					        speed=-30;
					        }
					        if(Math.abs(curr-option[attr])<Math.abs(speed)){
							isStop=true;
							}else{
								isStopAll=false;
							}
						}
						else{
							if(curr==option[attr]){ //减速动画的结束条件
							isStop=true;
							}				
							else{
							speed=(option[attr]-curr)/10;    //减速动画的速度
							speed=speed>0?Math.ceil(speed):Math.floor(speed);
							isStopAll=false;
							}//三目运算符，最终会返回一个值
						}
						if(isStop){
							if(isLinear){
								if(attr=='opacity'){
							         obj.style[attr]=option[attr]/100;
							         }  else{
							            obj.style[attr]=option[attr]+'px';
							            }
							}					
						}
							else{
								if(attr=='opacity'){
									obj.style[attr]=(curr+speed)/100;
								}else{
									obj.style[attr]=curr+speed+'px';
									}						
							}
					}
					if(isStopAll){
						clearInterval(obj.timer);
						if(fn){
							fn();
						}	
					}	
				},80);
			}