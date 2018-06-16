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
        projectName: '',
	      data: {},
        tefPath: '',
	      disabled: true,
	    },
	    cases: [],
      theme: 'light'
    }

		this.renderEndpointData = this.renderEndpointData.bind(this);
  }

	renderEndpointData(endpoint) {
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
          endpointInformation.push(
            <div className={styles.container}>
              <label className={styles.label}>Parameter: </label>
              <input id={endpointName + '_' + parameterName} value={parameterName} className={styles.inputBox} disabled/>
              <label className={styles.label}>Type: </label>
              <input id={endpointName + '_' + parameterName + '_' + parameterType} className={styles.inputBox} disabled/>
              <label className={styles.label}>Test Value: </label>
              <input id={endpointName +'_' + parameterName + '-' + testValue} className={styles.inputBox} disabled/>
            </div>
          )
        })
      } else {
        endpointInformation.push(
          <div className={styles.container}>
            <label className={styles.label}>This endpoint has no parameters</label>
          </div>
        )
      }
      endpointInformation.push(
        <div className={styles.container}>
          <label className={styles.label}>Response Success Code: </label>
          <input id={endpointName + '_' + 'successCode'} value={endpointSuccessCode} className={styles.inputBox} disabled/>
        </div>
      )
      endpointInformation.push(
        <div className={styles.container}>
          <label className={styles.label}>Response Fail Code: </label>
          <input id={endpointName + '_' + 'failCode'} value={endpointFailCode} className={styles.inputBox} disabled/>
        </div>
      )
      return endpointInformation;
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
