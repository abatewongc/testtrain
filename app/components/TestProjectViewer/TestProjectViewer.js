import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { connect } from "react-redux";
const { Header, Content, Footer, Sider } = Layout;
import EndpointViewer from '../EndpointViewer/EndpointViewer'
import { Z_FIXED } from 'zlib';
import { inherits } from 'util';
import { loadEndpoint, clearEndpoint } from "../../actions/endpoint-viewer";
import { Collapse } from 'antd';
const Panel = Collapse.Panel;
import paths from 'path'

import Testcase from '../Testcase/Testcase'

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

		this.extractTestcasesFromTEF = this.extractTestcasesFromTEF.bind(this);
		this.renderEndpointData = this.renderEndpointData.bind(this);
		this.createTestCaseObject = this.createTestCaseObject.bind(this);
	}

	createTestCaseObject(endpoint) {
		// ************************************************************** */
		// THIS IS WHERE WE WOULD GET THE DATA FROM THE TEF
		// ANY HARDCODED DATA IN THIS METHOD WOULD BE EXTRACTED IN THIS BLOCK
		let _name = 'experimental'
		// ************************************************************** */
		let testcase = {
			name: _name,
			fullurl: paths.join(endpoint.name.replace(new RegExp('&', 'g'), '/'), '/', _name),
			success: endpoint.data.successCode,
			fail: endpoint.data.failCode,
			successoutput: [
				{
					text: "experimental_success"
					// other stuff?
				}
			],
			failoutput:[
				{
					text: "experimental_failure"
					// other this?
				}
			],
			input: [
				{
					parameter: "1",
					type: "string",
					value: "hi",
				},
				{
					parameter: "2",
					type: "integer",
					value: "2",
				},{
					parameter: "3",
					type: "boolean",
					value: "0",
				}
			]

		}

		return testcase;
	}

	extractTestcasesFromTEF(endpoint) {
		let testcase1 = this.createTestCaseObject(endpoint);
		let testcase2 = this.createTestCaseObject(endpoint);
		let testcase3 = this.createTestCaseObject(endpoint);
		let testcase4 = this.createTestCaseObject(endpoint);
		let testcase5 = this.createTestCaseObject(endpoint);

		return [ testcase1, testcase2, testcase3, testcase4, testcase5 ];
	}

	renderEndpointData(endpoint) {
		if(endpoint) {
			let testcases = this.extractTestcasesFromTEF(endpoint);
			if(testcases == null) {
				return (
					<p>{JSON.stringify(endpoint.data)}</p>
				);
			} else {
					return (
						<Collapse>
						{testcases.map((tc, index) => (<Testcase testcase={tc} key={tc.name.concat('_testcase_').concat(index)} />))}
						</Collapse>
					);
			}
		}
	}

	render() {

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
