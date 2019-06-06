import React,{ Component,Fragment } from 'react'

import {
Layout, Menu,Dropdown
} from 'antd';

import './index.css'
import { getUserName,request,removeUserName } from 'util'
import { USER_LOGOUT } from 'api'


const { Header } = Layout;

class AdminHeader extends React.Component {
  constructor(props){
    super(props);
  }  
  handleLayout(){
    request({
      url:USER_LOGOUT
    })
    .then(result=>{//退出成功,清除本地的信息
      removeUserName()
      //2.页面跳转到登录页面
      window.location.href = '/login'
    })
  }
  render() {
    const menu = (
      <Menu onClick={this.handleLayout}>
        <Menu.Item key="0" className="layout">
          <a href="#">退出</a>
        </Menu.Item>
      </Menu>
    );
    return (
      <div className='admin-home'>
          <Layout>
           <Header className="header">
              <div className="logo" />
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                style={{ lineHeight: '64px' }}
              >
                <Menu.Item key="1" className="title">kmall</Menu.Item>
                <Dropdown className='dropdown' overlay={menu} trigger={['click']}>
                  <a className="ant-dropdown-link" href="#">
                     点击
                  </a>
                </Dropdown>
              </Menu>
            </Header>
          </Layout>
      </div>
    );
  }
}

export default AdminHeader;



