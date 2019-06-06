import React,{ Component,Fragment } from 'react'


import {
  Form, Icon, Input, Button, Checkbox,Layout, Menu, Breadcrumb,Dropdown
} from 'antd';

import './index.css'

import AdminHeader from 'common/header';
import AdminSlide from 'common/slide';


const { Content } = Layout;


class AdminLayout extends React.Component {
  constructor(props){
    super(props);
  }
  
  render() {
    return (
      <div className='layout'>
          <Layout>
            <AdminHeader />
            <Layout>
              <AdminSlide />
              <Layout style={{ padding: '0 24px 24px' }}>
                <Content style={{
                  background: '#fff', padding: 24, margin: 0, minHeight: 280,
                  width: 1648,marginLeft: 200,marginTop: -192
                }}
                >
                  {this.props.children}
              </Content>
              </Layout>
            </Layout>
          </Layout>
      </div>
    );
  }
}

export default AdminLayout;



