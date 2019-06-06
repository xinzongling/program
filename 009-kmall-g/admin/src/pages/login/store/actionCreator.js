// as types 给action起个名字
import * as types from './actionTypes.js';
import axios from 'axios';
import { message } from 'antd';

import { request,setUserName } from 'util';
import { ADMIN_LOGIN } from 'api';

const getLoginRequestAction = ()=>{ 
 	return { 
 		type:types.LOGIN_REQUEST 
 	} 
} 
const getLoginDoneAction = ()=>{ 
 	return { 
 		type:types.LOGIN_DONE 
 	} 
} 

export const getLoginAction=(values)=>{
	return (dispatch)=>{ 
		//1.让登录按钮处于加载状态 
 		//1.1 其实就是需要改变state.login.isFetching 为 true 
 		//1.2 方法就是派发action 
		//1.3 dispatch把action派发到store 
		//1.4 store再把action转交个reducer 
 		//1.5 相当于程序流程走到./reducer.js 
 		dispatch(getLoginRequestAction());/*  
        axios({ 
         	method:'post', 
        	url:'http://127.0.0.1:3000/admin/login', 
         	data:values 
        }) 
        .then(result=>{ 
        	// console.log(result) 
       		if(result.data.code == 0){//登录成功 
         		//跳转到后台首页 
         		window.location.href = "/" 
         	}else if(result.data.code == 1){ 
         		message.error(result.data.message) 
         	} 
        }) 
        .catch(err=>{ 
         	console.log(err); 
         	message.error('网络请求失败,请稍后再试') 
        }) 
        .finally(()=>{ 
         	//2.让登录按钮处于活动状态 
         	dispatch(getLoginDoneAction()) 
        })	*/

        request({ 
            method:'post', 
            url:ADMIN_LOGIN, 
            data:values 
        })
        .then(result=>{ 
            if(result.code == 0){//登录成功 
                setUserName(result.data.username);
                //跳转到后台首页 
                window.location.href = "/" 
            }else if(result.code == 1){ 
                message.error(result.message) 
            } 
        }) 
        .catch(err=>{ 
            console.log(err); 
            message.error('网络请求失败,请稍后再试') 
        }) 
        .finally(()=>{ 
            //2.让登录按钮处于活动状态 
            dispatch(getLoginDoneAction()) 
        })	 
 	} 
}