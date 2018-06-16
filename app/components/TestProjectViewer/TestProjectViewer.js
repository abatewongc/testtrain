import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { connect } from "react-redux";
const { Header, Content, Footer, Sider } = Layout;
import EndpointViewer from '../EndpointViewer/EndpointViewer'
import { Z_FIXED } from 'zlib';
import { inherits } from 'util';
import { loadEndpoint, clearEndpoint } from "../../actions/endpoint-viewer";

const mapStateToProps = state => {
    return { endpoint: state.current_endpoint_reducer.current_endpoint.endpoint };
};

const mapDispatchToProps = dispatch => {
    return {
      loadEndpoint: endpoint => dispatch(loadEndpoint(endpoint)),
      clearEndpoint: endpoint => dispatch(clearEndpoint(endpoint)),
    };
};

class ConnectedTestProjectViewer extends React.Component {
	constructor() {
		super();
		this.state = {
	    current_endpoint: {
	      name: '',
	      data: {},
	      disabled: true,
	    },
	    cases: []
    }

		this.renderEndpointData = this.renderEndpointData.bind(this);
  }

	renderEndpointData(endpoint) {
		if(endpoint) {
			return <p>{JSON.stringify(endpoint.data)}</p>
		}
	}

	render() {
		console.log(this.props.endpoint);

		return (
	    <Layout style={{ marginLeft: 0 , height: '100vh'}}>
	      <Header style={{ background: '#F1F2F6', padding: 0, Position: 'fixed', zIndex: 1, height: '64px', overflow: 'hidden'}}>
	          <EndpointViewer endpoint={this.state.current_endpoint}/>
	      </Header>
	      <Content style={{ margin: '24px 16px 0', overflow: 'auto', height: '95%' }}>
	        <div style={{ padding: 24, background: '#fff', height: '100%', overflow: 'scroll'}}>
						{this.renderEndpointData(this.props.endpoint)}
					</div>
	      </Content>
	      <Footer style={{ textAlign: 'center', height: '24px', zIndex: 1 }}>
	        Something would go here, IDK, maybe remove
	      </Footer>
	    </Layout>
    )
  }
}

const TestProjectViewer = connect(mapStateToProps, mapDispatchToProps)(ConnectedTestProjectViewer);

export default TestProjectViewer;
