import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import EndpointViewer from '../EndpointViewer/EndpointViewer'
import { Z_FIXED } from 'zlib';
import { inherits } from 'util';

export default class TestProjectViewer extends React.Component {
	constructor() {
		super();
		this.state = {
            current_endpoint: {
              name: 'null',
              path: '/null/',
            },
            cases: []
        }
    }



// F1F2F6
    render() {
		return (
            <Layout style={{ marginLeft: 0 , height: '100vh'}}>
              <Header style={{ background: '#F1F2F6', padding: 0, Position: 'fixed', zIndex: 1, height: '64px', overflow: 'hidden'}}>
                  <EndpointViewer endpoint={this.state.current_endpoint}/>
              </Header>
              <Content style={{ margin: '24px 16px 0', overflow: 'auto', height: '95%' }}>
                <div style={{ padding: 24, background: '#fff', textAlign: 'center', height: '100%', overflow: 'scroll'}}>

                </div>
              </Content>
              <Footer style={{ textAlign: 'center', height: '24px', zIndex: 1 }}>
                Something would go here, IDK, maybe remove
              </Footer>
            </Layout>
        )
    }
}
