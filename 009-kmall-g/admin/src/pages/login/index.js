import React,{ Component,Fragment } from 'react'
import axios from 'axios';

import {
  Form, Icon, Input, Button, Checkbox,message
} from 'antd';
import './index.css'
 
//1.react-redux 里面的connect方法负责把store里面的数据和方法映射到UI组件 
//2.因为connect来自于react-redux,而顶层的组件Provider(/src/index.js中的Provider)来自于react-redux,并且在Provider中指定了整个应用的store 
//所以,connect方法中能够拿到整个应用的state和dispatch方法 
//3.connect会把state和dispatch传递个调用时的参数方法 
import { connect } from 'react-redux';

//1.引入login相关的action 
//2.相当于引用'./store/index.js'中的actionCreator 
//3.而'./store/index.js'中的actionCreator是引入'./actionCreator.js'中的所有action的别名 
import { actionCreator } from './store' 

class NormalLoginForm extends React.Component {
  constructor(props){
    super(props);
    this.state={
      isFetching:false
    }
  }
  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.handleLogin(values);
        /*
        console.log('Received values of form: ', values);
        this.setState={
          isFetching:true
        }
        axios({
          url:'http://127.0.0.1:3000/admin/login',
          data:values,
          method:'post'
        })
        .then(result=>{
          //console.log(result);
          if(result.data.code==0){//登录成功,跳转页面
            window.location.href='/';
          }else{//登录失败,给一个提示信息
            message.error('用户名不存在,请重新登录');
          }
        })
        .catch(err=>{
          message.error('网络请求失败,请稍后再试');
        })
        .finally(()=>{
          this.setState={
              isFetching:false
          }
        })
        */
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div id="login">
        <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户名!' }],
            })(
              <Input  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }],
            })(
              <Input  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
            )}
          </Form.Item>
          <Form.Item>          
            <Button 
              type="primary" 
              htmlType="submit" 
              className="login-form-button"
              loading={this.props.isFetching}
              >
              登录
            </Button>    
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);
//1.这个方法是connect的第一个参数 
//2.connect方法会把整个应用的顶层数据(state)作为参数传递到这个方法 
//3.整个应用的顶层数据(state)有创建store是传入的reducer生成,即src/store/reducer.js生成 
//4.src/store/reducer.js里面的数据是由每一个组件自己的reduer合并而成 
//5.因此state里面有每一个组件自己的数据 
//6.该方法返回一个对象,这个对象的属性会映射到connect方法返回的方法指定的UI组件上的this.props上 
//因为在总的reducer.js中用到了immutable,所以要用get方法
const mapStateToProps=(state)=>{
  return {
    isFetching:state.get('login').get('isFetching')
  }
}

//1.这个方法是connect的第二个参数 
//2.connect方法会把store上的dispatch方法作为参数传递到这个方法 
//3.该方法返回一个对象,这个对象的属性会映射到connect方法返回的方法指定的UI组件上的this.props上 
//4.返回对象的属性对应的值是一个方法 
const mapDispatchToProps=(dispatch)=>{
   return {
      handleLogin:(values)=>{
        //1.派发登录的action 
        //2.其实这个登录的action是一个能够发送ajax请求的函数 
        //3.dispatch能够派发函数是因为引用了redux-thunk 
        //4.使用redux-thunk派发一个函数action的时候,会把dispatch方法自身传递到该函数action中 
        const action = actionCreator.getLoginAction(values);
        dispatch(action);
      }
    }
}
//1.connect方法第一个参数指定映射数据的方法 
//2.connect方法第一个参数指定映射方法的方法 
//3.connect方法返回一个方法,这个方法用来指定UI组件,这个方法会返回一个容器组件 

export default connect(mapStateToProps,mapDispatchToProps)(WrappedNormalLoginForm);