import React, { Component } from 'react';
import { Layout, Menu, Icon, Divider } from 'antd';
import { connect } from "react-redux";
const { Header, Content, Footer, Sider } = Layout;
import EndpointViewer from '../EndpointViewer/EndpointViewer'
import { Z_FIXED } from 'zlib';
import { inherits } from 'util';
import { loadEndpoint, editEndpoint } from "../../actions/endpoint-viewer";
import styles from './TestProjectViewer.css';
import { Collapse } from 'antd';
const Panel = Collapse.Panel;
import paths from 'path'
const Store = require('electron-store');

import Testcase from '../Testcase/Testcase'

const mapStateToProps = state => {
    return {
      endpoint: state.current_endpoint_reducer.current_endpoint.endpoint,
      edit: state.current_endpoint_reducer.edit_endpoint
    };
};

const mapDispatchToProps = dispatch => {
    return {
      loadEndpoint: endpoint => dispatch(loadEndpoint(endpoint)),
      editEndpoint: edit => dispatch(editEndpoint(edit))
    };
};

class ConnectedTestProjectViewer extends React.Component {
	constructor() {
		super();
		this.state = {
	    current_endpoint: {
	      name: '',
        projectName: '',
	      data: {},
        tefPath: '',
	      disabled: true,
	    },
      edit: false,
	    cases: [],
      theme: 'light'
    }

		this.extractTestcasesFromTEF = this.extractTestcasesFromTEF.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.renderEndpoint = this.renderEndpoint.bind(this);
		this.renderEndpointData = this.renderEndpointData.bind(this);
    this.renderTestCases = this.renderTestCases.bind(this);
    this.handleParameterChange = this.handleParameterChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
		this.createTestCaseObject = this.createTestCaseObject.bind(this);
  }

  handleParameterChange = (parameterName, target) => (event) => {
    let testItemsLength = this.state.current_endpoint.data.testItems.length;
    for(let i = 0; i < testItemsLength; i++) {
      if(this.state.current_endpoint.data.testItems[i].parameter == parameterName) {
        this.state.current_endpoint.data.testItems[i][target] = event.target.value;
      }
    }
    this.forceUpdate();
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
    let testcases = [];

    let j = 40;
    for(let i = 0; i < j; i++) {
      testcases.push(this.createTestCaseObject(endpoint));
    }

		return testcases;
	}

  handleChange = (target) => (event) => {
    this.state.current_endpoint.data[target] = event.target.value;
    this.forceUpdate();
  }

  handleSubmit() {
    let endpointName = this.state.current_endpoint.name;
    let tefPath = this.state.current_endpoint.tefPath;
    let tefData = this.state.current_endpoint.data;
    let testItems = tefData.testItems;
    let successCode = tefData.successCode;
    let failCode = tefData.failCode;

    let tefFile = '\\' + endpointName + '.tef';
    let tefIndex = tefPath.indexOf(tefFile);
    let tefDirPath = tefPath.substring(0, tefIndex);

    let store = new Store({
      name: endpointName,
      cwd: tefDirPath,
      fileExtension: "tef"
    });

    store.set('testItems', testItems);
    store.set('successCode', successCode);
    store.set('failCode', failCode);

    this.props.editEndpoint(false);
    this.forceUpdate();
  }

  renderContent() {
    if(this.state.current_endpoint) {
      return <Collapse>{this.renderEndpoint()}{this.renderTestCases()}</Collapse>
    }
  }

  renderEndpoint() {
    if(this.state.current_endpoint) {
      return <Panel header="Endpoint Information" key="endpoint-info-panel">{this.renderEndpointData()}</Panel>
    }
  }

	renderEndpointData() {
    let endpoint = this.state.current_endpoint;
    let edit = this.state.edit;
    let handleParameterChange = this.handleParameterChange;
    let handleChange = this.handleChange;
		if(endpoint) {
      let endpointInformation = [];
      let parameters = endpoint.data.testItems;
      let endpointName = endpoint.name;
      let endpointSuccessCode = endpoint.data.successCode;
      let endpointFailCode = endpoint.data.failCode;
      if(parameters && parameters.length > 0) {
        parameters.forEach(function(parameter) {
          let parameterName = parameter.parameter;
          let parameterType = parameter.type;
          let testValue = parameter.testValue;
          if(edit) {
            endpointInformation.push(
              <div className={styles.container}>
                <label className={styles.label}>Parameter: </label>
                <input id={parameterName} value={parameterName} className={styles.inputBox} onChange={handleParameterChange(parameterName, 'parameter')} />
                <label className={styles.label}>Type: </label>
                <input id={parameterName + '_' + parameterType} value={parameterType} className={styles.inputBox} onChange={handleParameterChange(parameterName, 'type')} />
                <label className={styles.label}>Test Value: </label>
                <input id={testValue} value={testValue} className={styles.inputBox} onChange={handleParameterChange(parameterName, 'testValue')} />
              </div>
            )
          } else {
            endpointInformation.push(
              <div className={styles.container}>
                <label className={styles.label}>Parameter: </label>
                <input id={endpointName + '_' + parameterName} value={parameterName} className={styles.inputBox} disabled/>
                <label className={styles.label}>Type: </label>
                <input id={endpointName + '_' + parameterName + '_' + parameterType} value={parameterType} className={styles.inputBox} disabled/>
                <label className={styles.label}>Test Value: </label>
                <input id={endpointName +'_' + parameterName + '-' + testValue} value={testValue} className={styles.inputBox} disabled/>
              </div>
            )
          }
        })
      } else {
        endpointInformation.push(
          <div className={styles.container}>
            <label className={styles.label}>This endpoint has no parameters</label>
          </div>
        )
      }
      if(edit) {
        endpointInformation.push(
          <div className={styles.container}>
            <label className={styles.label}>Response Success Code: </label>
            <input id={'successCode'} value={endpointSuccessCode} className={styles.inputBox} onChange={handleChange('successCode')} />
          </div>
        )
        endpointInformation.push(
          <div className={styles.container}>
            <label className={styles.label}>Response Fail Code: </label>
            <input id={'failCode'} value={endpointFailCode} className={styles.inputBox} onChange={handleChange('failCode')} />
              <button type="button" className={styles.submit} onClick={this.handleSubmit}>Submit</button>
          </div>
        )
      } else {
        endpointInformation.push(
          <div className={styles.container}>
            <label className={styles.label}>Response Success Code: </label>
            <input id={'successCode'} value={endpointSuccessCode} className={styles.inputBox} disabled/>
          </div>
        )
        endpointInformation.push(
          <div className={styles.container}>
            <label className={styles.label}>Response Fail Code: </label>
            <input id={'failCode'} value={endpointFailCode} className={styles.inputBox} disabled/>
          </div>
        )
      }
      return endpointInformation;
		}
	}

  renderTestCases() {
    if(this.state.current_endpoint) {
      let testcases = this.extractTestcasesFromTEF(this.state.current_endpoint);
      if(testcases) {
        return testcases.map((tc, index) => (<Testcase testcase={tc} key={tc.name.concat('_testcase_').concat(index)} />))
      }
    }
  }

	render() {
    this.state.current_endpoint = this.props.endpoint;
    this.state.edit = this.props.edit;
		return (
	    <Layout style={{ marginLeft: 0 , height: '100vh'}}>
	      <Header style={{ background: '#F1F2F6', padding: "2px 0px 2px 0px", Position: 'fixed', zIndex: 1, height: '64px', overflow: 'hidden'}}>
	          <EndpointViewer endpoint={this.state.current_endpoint}/>
	      </Header>
        <Divider style={{ margin: '4px 4px 4px 4px'}}/>
	      <Content style={{ margin: '8px 16px 0', overflow: 'auto', height: '95%' }}>
	        <div style={{ padding: "8px 16px 0px", background: '#F1F2F6', height: '100%', overflow: 'scroll'}}>
            {this.renderContent()}
					</div>
	      </Content>
	      <Footer style={{ textAlign: 'center', height: '24px', zIndex: 1 }}>
	        Something will go here, IDK, maybe remove
	      </Footer>
	    </Layout>
    )
  }
}

const TestProjectViewer = connect(mapStateToProps, mapDispatchToProps)(ConnectedTestProjectViewer);

export default TestProjectViewer;
