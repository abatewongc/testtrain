import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { connect } from "react-redux";
const { Header, Content, Footer, Sider } = Layout;
import EndpointViewer from '../EndpointViewer/EndpointViewer'
import { Z_FIXED } from 'zlib';
import { inherits } from 'util';
import { loadEndpoint, clearEndpoint } from "../../actions/endpoint-viewer";
import styles from './TestProjectViewer.css'

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

		this.renderEndpointData = this.renderEndpointData.bind(this);
    this.handleParameterChange = this.handleParameterChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleChange = (target) => (event) => {
    this.state.current_endpoint.data[target] = event.target.value;
    console.log(this.state.current_endpoint);
    this.forceUpdate();
  }

  handleSubmit() {

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
          </div>
        )
        endpointInformation.push(
          <div className={styles.container}>
            <button type="button" className={styles.submit}>Submit</button>
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

	render() {
    this.state.current_endpoint = this.props.endpoint;
    this.state.edit = this.props.edit;
		return (
	    <Layout style={{ marginLeft: 0 , height: '100vh'}}>
	      <Header style={{ background: '#F1F2F6', padding: 0, Position: 'fixed', zIndex: 1, height: '64px', overflow: 'hidden'}}>
	          <EndpointViewer endpoint={this.state.current_endpoint}/>
	      </Header>
	      <Content style={{ margin: '24px 16px 0', overflow: 'auto', height: '95%' }}>
	        <div style={{ padding: 24, background: '#fff', height: '100%', overflow: 'scroll'}}>
						{this.renderEndpointData()}
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
