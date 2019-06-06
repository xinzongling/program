import React,{ Component,Fragment } from 'react'

import {NavLink} from 'react-router-dom'
import {
  Form, Icon, Input, Button, Checkbox,Layout, Menu, Breadcrumb,Dropdown
} from 'antd';


const { Header, Content, Sider } = Layout;

import './index.css'

import { connect } from 'react-redux';

const menu = (
  <Menu>
    <Menu.Item key="0" className="layout">
      <a href="#">退出</a>
    </Menu.Item>
  </Menu>
);

class AdminSlide extends React.Component {
  constructor(props){
    super(props);
  }
  
  render() {
    return (
      <div className='slide'>
          <Layout>
            <Layout>
              <Sider width={200} style={{ background: '#fff' }}>
                <Menu
                  mode="inline"
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  style={{ height: '100%', borderRight: 0 }}
                >
                  <Menu.Item key="1">
                      <NavLink to="/" key="1">首页</NavLink>
                  </Menu.Item>
                  <Menu.Item key="2">    
                      <NavLink to="/user"  key="2">用户列表</NavLink>
                  </Menu.Item>
                  <Menu.Item key="3">      
                      <NavLink to="/category"  key="3">分类管理</NavLink>
                  </Menu.Item>
                  <Menu.Item key="4">      
                      <NavLink to="/product"  key="4">商品管理</NavLink>
                  </Menu.Item>
                  <Menu.Item key="5">      
                      <NavLink to="/order"  key="4">订单管理</NavLink>
                  </Menu.Item>    
                </Menu>
              </Sider>
            </Layout>
          </Layout>
      </div>
    );
  }
}

export default AdminSlide;



