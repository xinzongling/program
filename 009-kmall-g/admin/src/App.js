import React,{ Component,Fragment } from 'react'


//引入WrappedNormalLoginForm组件 
//等价于引入 './pages/login/index.js' 

import WrappedNormalLoginForm from 'pages/login';
import Home from 'pages/home';
import User from 'pages/user';
import Category from 'pages/category';
import CategoryAdd from 'pages/category/add.js';
import Product from 'pages/product';
import Order from 'pages/order'


import './App.css'
import { getUserName } from 'util';

import {
  BrowserRouter as Router,
  // HashRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'


class App extends Component{
	render(){//自定义路由写在render中
		const ProtectRoute = ({component:Component,...rest})=>{
			return (
				<Route 
					{...rest}
					render = {props=>{
						return getUserName()
						? <Component {...props} />
						: <Redirect to="/WrappedNormalLoginForm" />
					}}
				/>
		)}
		const LoginRoute = ({component:Component,...rest})=>{ 
 			return getUserName() 
 			? <Redirect to="/" /> 
 			: <Component {...rest} /> 
 		} 
		return( 
			<Router>
				<div className="App">
				<Switch>
					<ProtectRoute exact  path='/' component={ Home } />
					<LoginRoute path='/WrappedNormalLoginForm' component={ WrappedNormalLoginForm } />
					<Route  path='/user' component={ User } />
					<Route  path='/category' component={ Category } />
					{/*<Route exact path='/category/add' component={ CategoryAdd } />*/}
					<Route  path='/product' component={ Product } />
					<ProtectRoute path="/order" component={Order} />
				</Switch>	
				</div>
			</Router>
		)
	}
}

export default App;



