function getLength(sVal){
	return sVal.replace(/[\u4e00-\u9fa5]/g,'aa').length;
}
function setError(aMsg,str,Inputname){
	aMsg.className="error";
	aMsg.innerHTML=str;
	if(Inputname){                           //由于最后一个复选框的msg比较特殊，没有第三个变量，所以需要做判断
		Inputname.className='input-error'; 
	}
}
function setOk(aMsg,Inputname){
	aMsg.className="ok";
	aMsg.innerHTML='';
	Inputname.className='';
}
/*1,获取元素*/
var oForm=document.forms[0];
var oUsername=oForm.username;
var oCancel=document.querySelectorAll('.cancel');
var oMsg=document.querySelectorAll('.msg');
var oTelephone=oForm.telephone;
var oPassword=oForm.password;
var oChecklist=document.getElementById('checkList');
var PwdLi=oChecklist.getElementsByTagName('li');
var oIdentify=oForm.identify;
var oGetcode=document.getElementsByClassName('getcode');
var oAgree=document.getElementById('agree');
var oBtn=document.getElementById('button');

//定义全局变量
var bUsername=false,bPhone=false,bPwd=false,bIdentify=false;
/*2初始化页面*/
init();
function init(){
	oUsername.focus();
	oMsg[0].className="tiptext";
	oMsg[0].innerHTML='设置后不可更改<br>中英文均可，最长14个英文或7个汉字';
	//用事件委托的方法处理显示和隐藏取消按钮
	oForm.oninput=function(ev){
		var iev=ev||event;
		var oInput=iev.target;
		var aCancel=oInput.nextElementSibling;
		if(oInput.value.length>0){
			aCancel.style.display="inline-block";//这里的显示需要用行内块状显示，注意最后一个checkbox输入框。
		}else{
			aCancel.style.display="none";
		}
	}
	oForm.onclick=function(ev){
			var iev=ev||event;
			var aCancel=iev.target;
			var oInput=aCancel.previousElementSibling;
		    if(oInput){
		    	switch(oInput.name){
		    		case "username":
		    		case "telephone":
		    		case "password":
		    		case "identify":
		    		oInput.value='';
					aCancel.style.display="none";
					oInput.focus();
					break;
		    	}
		    }
		}
}
/*4，验证用户名*/
checkUsername();
function checkUsername(){
	/*3显示隐藏取消按钮*/
	oUsername.onfocus=function(){
		oMsg[0].className="tiptext";
		oMsg[0].innerHTML='设置后不可更改<br>中英文均可，最长14个英文或7个汉字';
	}
	oUsername.onblur=function(){
		var sVal=oUsername.value;
		//不能为纯数字
		var reg1=/^\s+$/;
		//用户名仅支持中英文、数字和下划线,且不能为纯数字
		var reg2=/[^a-z\u4e00-\u9fa5_\d]/ig;
		var reg3=/^\d+$/;
		//什么都没有输入
		if(sVal == ""){
			oMsg[0].className='msg';
			oMsg[0].innerHTML='';
			oUsername.className='';
			bUsername=false;
		}
		//输入为全空格
		else if(reg1.test(sVal)){
			setError(oMsg[0],"请输入用户名",oUsername);
			bUsername=false;
		}
		//不能超过14个字符或7个汉字
		else if(getLength(sVal)>14){
			setError(oMsg[0],"用户名不能超过7个汉字或14个字符",oUsername);
			bUsername=false;
		}
		//用户名仅支持中英文、数字和下划线,且不能为纯数字
		else if(reg2.test(sVal)||reg3.test(sVal)){
			setError(oMsg[0],"用户名仅支持中英文、数字和下划线,且不能为纯数字",oUsername);
			bUsername=false;
		}
		else{
			setOk(oMsg[0],oUsername);
			bUsername=true;
		}
	}
}

/*5，验证手机号*/
checkTelephone();
function checkTelephone(){
	/*3显示隐藏取消按钮*/
	oTelephone.onfocus=function(){
		oMsg[1].className="tiptext";
		oMsg[1].innerHTML='请输入中国大陆手机号，其他用户不可见';
	}
	oTelephone.onblur=function(){
		var sVal=oTelephone.value;
		//全空格
		var reg1=/^\s+$/;
		//全数字
		var reg2=/^\d+$/;
		//电话号码以13，115，17，18，19开头的
		var reg3=/^1[35789]\d{9}$/;
		//什么都没有输入
		if(sVal == ""){
			oMsg[1].className='msg';
			oMsg[1].innerHTML='';
			//解决上一次输入错误，进入输入框然后又离开输入框，此时输入框的显示问题
			oTelephone.className='';
			bphone=false;
		}
		//输入为全空格
		else if(reg1.test(sVal)){
			setError(oMsg[1],"请输入手机号",oTelephone);
			bphone=false;
		}
		//纯数字
		else if(!reg2.test(sVal)){
			setError(oMsg[1],"手机号码格式不正确",oTelephone);
			bphone=false;
		}
		//电话号码以13，115，17，18，19开头的
		else if(!reg3.test(sVal)){
			setError(oMsg[1],"手机号码格式不正确",oTelephone);
			bphone=false;
		}
		else{
			setOk(oMsg[1],oTelephone);
			bphone=true;
		}
	}
	//对输入手机号码的限制（只能输入数字，退格键，删除键，而且输入数字的长度不能超过11位）
	oTelephone.onkeydown=function(ev){
		var iev=ev || event;
		if((iev.keyCode<48 ||iev.keyCode>57||oTelephone.value.length>11)
			&&iev.keyCode!=8
			&&iev.keyCode!=37
			&&iev.keyCode!=39)
			{
			return false;
		}
	}
}

/*6验证密码*/
checkPassword();
function checkPassword(){
	var pwd1=false,pwd2=false,pwd3=false;
	//当密码输入框获取焦点时，列表显示
	oPassword.onfocus=function(){
		oChecklist.style.display="block";
		oMsg[2].style.display="none";
	}
	//当在密码输入框输入时，进行实时验证。
	oPassword.oninput=function(){
		var sVal=oPassword.value;
		var setErrorClass="pwd-checkList-item-error";
		var setSuccsssClass="pwd-checkList-item-success";
		//长度为8~16个字符
		var reg1=/^.{8,16}$/;
		//支持数字，大小写字母和标点符号
		var reg2=/[^0-9a-z@#%\$\*\[\]\{\}\(\)\?]\s/i;
		//不允许有空格
		var reg3=/\s/;

		if(!reg1.test(sVal)){
			PwdLi[0].className=setErrorClass;
			pwd1=false;
		}else{
			PwdLi[0].className=setSuccsssClass;
			pwd1=true;
		}

		if(reg2.test(sVal)){
			PwdLi[1].className=setErrorClass;
			pwd2=false;
		}else{
			PwdLi[1].className=setSuccsssClass;
			pwd2=true;
		}

		if(reg3.test(sVal)){
			PwdLi[2].className=setErrorClass;
			pwd3=false;
		}else{
			PwdLi[2].className=setSuccsssClass;
			pwd3=true;
		}
	}
	//点击取消按钮时的特殊处理
	oCancel[2].onclick=function(){
		PwdLi[0].className="pwd-checkList-item";
		PwdLi[1].className="pwd-checkList-item";
		PwdLi[2].className="pwd-checkList-item";
		pwd1=false;
		pwd2=false;
		pwd3=false;
	}
	//当焦点离开密码输入框时,进行验证。
	oPassword.onblur=function(){
		var sVal=oPassword.value;
		if(sVal == ""){
			oChecklist.style.display="none";
		}
		//验证成功
		else if(pwd1&&pwd2&&pwd3){
			setOk(oMsg[2],oPassword);
			oChecklist.style.display="none";
			bPwd=true;
		}else{
			bPwd=false;
		}
	}
}

/*7验证验证码*/
checkIdentify();
function checkIdentify(){
	//手机号码为空
	oGetcode[0].onclick=function(){
		if(oTelephone.value == ""){
			setError(oMsg[1],"请输入手机号",oTelephone);
			return false;
		}
		if(!bphone){
			return false;
		}
		//发送验证码请求
		alert('发送验证码请求');
	}
	oIdentify.onblur=function(){
		var sVal=oIdentify.value;
		var reg=/^[0-9a-z]{6}$/;
		if(sVal == ""){
			oMsg[3].className='msg';
			//解决上一次输入错误，进入输入框然后又离开输入框，此时输入框的显示问题
			oIdentify.className='';
			bIdentify=false;
		}else if(!reg.test(sVal)){
			setError(oMsg[3],"验证码格式错误",oIdentify);
			bIdentify=false;
		}
		else{
			setOk(oMsg[3],oIdentify);
			bIdentify=true;
		}
	}
	oIdentify.onkeydown=function(ev){
		var iev=ev || event;
		var reg=/^[0-9a-z]{6}/i;
		//console.log(iev.keyCode);
		if(oIdentify.value.length>5){
			return false;
		}
		if(iev.keyCode<48
			&&iev.keyCode!=8
			&&iev.keyCode!=20
			&&iev.keyCode!=37
			&&iev.keyCode!=39
			){
			return false;
		}
		if(iev.keyCode<65&&iev.keyCode>57){
			return false;
		}
		if(iev.keyCode>90){
			return false;
		}
	}
	oIdentify.onfocus=function(){
		oMsg[3].className='msg';
		oMsg[3].innerHTML='';
	}
}

//处理提交
handleSubmit()
function handleSubmit(){
	oBtn.onclick=function(){
		//输入全空
		if(oUsername.value==""){
			setError(oMsg[0],"请你输入用户名",oUsername);
		}
		if(oTelephone.value==""){
			setError(oMsg[1],"请你输入手机号",oTelephone);
		}
		if(oPassword.value==""){
			setError(oMsg[2],"请输入密码",oPassword);
		}
		if(oIdentify.value==""){
			setError(oMsg[3],"请输入验证码",oIdentify);
		}
		if(!oAgree.checked){
			setError(oMsg[4],"请勾选“阅读并接受百度用户协议");
		}
		if(bUsername&&bphone&&bPwd&bIdentify&oAgree.checked){
			oForm.submit();
		}
	}
}