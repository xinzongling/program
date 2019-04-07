;(function($){
	//1用户登录和注册面板的一个切换
	var $register=$('#register');
	var $login=$('#login');

	$('#go-register').on('click',function(){
		$register.show();
		$login.hide();
	});
	$('#go-login').on('click',function(){
		$login.show();
		$register.hide();
	});


	var usernameReg=/^[a-z][0-9|a-z_]{2,9}$/;	
	var passwordReg=/^\w{3,6}$/;
	$('#sub-register').on('click',function(){//处理注册
		//获取表单中的数据
		var username=$register.find('[name=username]').val();
		var passsword=$register.find('[name=password]').val();
		var repasssword=$register.find('[name=repassword]').val();
		
		//进行验证
			//用户名只能以字母开头,包含数字。下划线的3-10位字符
			//密码3-6位字符串

		var errMsg='';
		var $err=$register.find('.err');
		
		if(!usernameReg.test(username)){
			errMsg='用户名只能以字母开头,包含数字。下划线的3-10位字符';
		}
		else if(!passwordReg.test(passsword)){
			errMsg='密码3-6位字符串';
		}
		else if(passsword!==repasssword){
			errMsg='两次密码输入不一致';
		}
		if(errMsg){
			//验证不通过
			$err.html(errMsg);
			return;
		}else{//验证通过,向后台发送ajax请求
			$err.html('');
			$.ajax({
				url:'/user/register',
				dataType:'json',
				type:'post',
				data:{
					username:username,
					password:passsword
				}
			})
			.done(function(result){
				console.log('result',result)
				if(result.status==0){
					//成功
					$('#go-login').trigger('click');
				}else{
					$err.html(result.message);
				}
			})
			.fail(function(err){
				$err.html('请求失败,请你稍后再试');
			})
		};
	});

	$('#sub-login').on('click',function(){//处理登录
		var username=$login.find('[name=username]').val();
		var passsword=$login.find('[name=password]').val();

		var errMsg='';
		var $err=$login.find('.err');
		
		if(!usernameReg.test(username)){
			errMsg='用户名只能以字母开头,包含数字。下划线的3-10位字符';
		}
		else if(!passwordReg.test(passsword)){
			errMsg='密码3-6位字符串';
		}
		if(errMsg){
			$err.html(errMsg);
			return;
		}else{
			$err.html('');
			$.ajax({
				url:'/user/login',
				dataType:'json',
				type:'post',
				data:{
					username:username,
					password:passsword
				}
			})
			.done(function(result){
				if(result.status==0){
					/*$login.hide();
					$('#user-info').find('span').html(result.data.username);
					$('#user-info').show();*/
					window.location.reload();
				}else{
					$err.html(result.message);
				}
			})
			.fail(function(err){
				$err.html('请求失败,请你稍后再试');
			})
		};
	});

	//退出
	$('#logout').on('click',function(){
		var $err=$login.find('.err');
		$.ajax({
			url:'user/logout'
		})
		.done(function(result){
			if(result.status==0){
				window.location.reload();
			}else{
				$err.html(result.message);
			}
		})
		.fail(function(err){
			$err.html('请求失败,请你稍后再试');
		})
	});

	//4.文章列表分页
	var $articlePagination=$('#article-page');

	function buildArticleListHtml(articles){
		var html='';
		for(var i = 0;i<articles.length;i++){
			var createTime=moment(articles[i].createTime).format('YYYY年MM月DD日 H:mm:ss')
			html+=`<div class="panel panel-default content-item">
					<div class="panel-heading">
				    	<h3 class="panel-title">
				    		<a href="/view/${ articles[i]._id.toString() }" class="link" target="_blank">${ articles[i].title }</a>
				    	</h3>
					</div>
					<div class="panel-body">
						${ articles[i].intro }
					</div>
					<div class="panel-footer">
						<span class="glyphicon glyphicon-user"></span>
						<span class="panel-footer-text text-muted">${ articles[i].user.username }</span>
						<span class="glyphicon glyphicon-th-list"></span>
						<span class="panel-footer-text text-muted">${ articles[i].category.name }</span>
						<span class="glyphicon glyphicon-time"></span>
						<span class="panel-footer-text text-muted">${ createTime }</span>
						<span class="glyphicon glyphicon-eye-open"></span>
						<span class="panel-footer-text text-muted"><em>${ articles[i].click }</em>已阅读</span>
					</div>
				</div>`
		};

		return html
	}
	function buildArticlePaginationHtml(arr,page){
		var html='';
		html+=`<li>
		        	<a href="javascript:;" aria-label="Previous">
		        		<span aria-hidden="true">&laquo;</span>
		        	</a>
		   		</li>`
		arr.forEach(function(value){
			if(value==page){
				html+=`<li class="active"><a href="javascript:;">${ value }</a></li>`
			}else{
				html+=`<li><a href="javascript:;">${ value }</a></li>`
			}
		})  
		html+=`<li>
		        	<a href="javascript:;" aria-label="Next">
		        		<span aria-hidden="true">&raquo;</span>
		        	</a>
		    	</li>`
		return html
	}
	function buildCommentListHtml(comments){
		var html='';
	
		comments.forEach(function(comment){
			var createTime=moment(comment.createTime).format('YYYY年MM月DD日 H:mm:ss');
			html+=`<div class="panel panel-default">
		              <div class="panel-heading">
		                ${ comment.user.username } 发表于 ${ createTime }
		              </div>
		              <div class="panel-body">
		                ${ comment.content }
		              </div>
		            </div>`
		})

		return html;
	}
	$articlePagination.on('get-data',function(ev,data){
		//1构建文章列表 构建html的目的是为了数据和更新的同步
		$('#article-wrap').html(buildArticleListHtml(data.docs));
		//2构建分页器
		var $pagination =$articlePagination.find('.pagination');
		if(data.pages>1){
			$pagination.html(buildArticlePaginationHtml(data.arr,data.page))
		}else{
			$pagination.html('');
		}
	})

	$articlePagination.pagination({
		url:'/articles'
	})


	//5.评论分页列表
	
	var $commentPagination=$('#comment-page');
	
		$commentPagination.on('get-data',function(ev,data){

		$('#comment-wrap').html(buildCommentListHtml(data.docs));
		var $pagination =$commentPagination.find('.pagination');
		if(data.pages>1){
			$pagination.html(buildArticlePaginationHtml(data.arr,data.page))
		}else{
			$pagination.html('');
		}
	})
	

	$commentPagination.pagination({
		url:'/comment/list'  //以后遇到路由问题,前面一定要加上/,否则容易出错
	})
})(jQuery);