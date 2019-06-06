import axios from 'axios';

export const request=(options)=>{

	return new Promise((resolve,rejected)=>{
			const params={
				url:options.url || '',
				method:options.method || 'get',
				withCredentials: true//目的是为了把浏览器上存储的用户信息发送到后台
			};
			switch(params.method.toUpperCase()){ 
	 			case 'GET': 
	 			case 'DELETE': 
	 				params.params = options.data 
	 				break 
	 			default: 
	 				params.data = options.data 
 			} 
			axios(params)
			.then(result=>{
				const data = result.data; 
	 			if(data.code == 10){//没有权限 
	 				//移除前端的登录信息 
	 				removeUserName(); 
	 				//跳转到登录页面 
	 				window.location.href = '/login' 
	 				reject('没有权限') 
	 			}else{ 
	 				resolve(result.data); 
	 			} 
			})
			.catch(err=>{
				rejected(err);
			})
	})
}

//本地存储
export const setUserName=(username)=>{
	window.localStorage.setItem('username',username)
}
export const getUserName=()=>{
	return window.localStorage.getItem('username');
}
export const removeUserName=()=>{
	window.localStorage.removeItem('username');
}