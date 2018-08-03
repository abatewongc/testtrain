import React, { Component } from 'react';
import { Layout, Menu, Icon, Divider, Collapse } from 'antd';
import { connect } from "react-redux";
import { Z_FIXED } from 'zlib';
import { inherits } from 'util';
import { loadEndpoint, editEndpoint, updateTestcases } from "../../actions/endpoint-viewer";
import EndpointViewer from '../EndpointViewer/EndpointViewer'
import styles from './TestProjectViewer.css';
import paths from 'path'
import { store } from '../../store/configureStore.js'
const { Header, Content, Footer, Sider } = Layout;
const Panel = Collapse.Panel;
const Store = require('electron-store');
const fs = require('fs');

import Testcase from '../Testcase/Testcase'

const mapStateToProps = state => {
    return {
      endpoint: state.current_endpoint_reducer.current_endpoint.endpoint,
      edit: state.current_endpoint_reducer.edit_endpoint,
      updateTestcases: state.current_endpoint_reducer.update_testcases
    };
};

const mapDispatchToProps = dispatch => {
    return {
      loadEndpoint: endpoint => dispatch(loadEndpoint(endpoint)),
      editEndpoint: edit => dispatch(editEndpoint(edit)),
      updateTestcases: updateTestcases => dispatch(updateTestcases(updateTestcases))
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
      updateTestcases: false,
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

	 createTestCaseObject(testcase) {
     let testcaseObject = {
       name: testcase.testcaseName,
       expectedResponseCode: testcase.testcaseInformation.expectedResponseCode,
       requestType: testcase.testcaseInformation.requestType
     }

     testcaseObject.parameters = testcase.testcaseInformation.parameters;
     testcaseObject.expectedValues = testcase.testcaseInformation.expectedValues;

     return testcaseObject;
   }

	extractTestcasesFromTEF() {
    let tefPath = this.state.current_endpoint.tefPath;
    let tef = JSON.parse(fs.readFileSync(tefPath, 'utf8'));
    let tefTestcases = tef.testcases;
    let testcases = [];

    tefTestcases.forEach(testcase => {
      testcases.push(this.createTestCaseObject(testcase));
    })

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
      return <Panel header="Endpoint Information" style={endpointInfoPanelStyle} key="endpoint-info-panel">{this.renderEndpointData()}</Panel>
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
          if(edit) {
            endpointInformation.push(
              <div className={styles.container}>
                <label className={styles.label}>Parameter: </label>
                <input id={parameterName} value={parameterName} className={styles.inputBox} onChange={handleParameterChange(parameterName, 'parameter')} />
                <label className={styles.label}>Type: </label>
                <input id={parameterName + '_' + parameterType} value={parameterType} className={styles.inputBox} onChange={handleParameterChange(parameterName, 'type')} />
              </div>
            )
          } else {
            endpointInformation.push(
              <div className={styles.container}>
                <label className={styles.label}>Parameter: </label>
                <input id={endpointName + '_' + parameterName} value={parameterName} className={styles.inputBox} disabled/>
                <label className={styles.label}>Type: </label>
                <input id={endpointName + '_' + parameterName + '_' + parameterType} value={parameterType} className={styles.inputBox} disabled/>
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
      let testcases = this.extractTestcasesFromTEF();
      if(testcases) {
        return testcases.map((tc, index) => (<Testcase testcase={tc} uuid={tc.name.concat('_testcase_').concat(index)} key={tc.name.concat('_testcase_').concat(index)} />))
      }
    }
  }

	render() {
    store.subscribe(() => {
      console.log(store.getState());
    });
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
	      <Footer style={{ textAlign: 'center', height: '4px', zIndex: 1, paddingTop: '4px', paddingBottom: '4px' }}>

	      </Footer>
	    </Layout>
    )
  }
}

const TestProjectViewer = connect(mapStateToProps, mapDispatchToProps)(ConnectedTestProjectViewer);


const endpointInfoPanelStyle = {
  background: '#d3e4ff',
};

export default TestProjectViewer;
