import React, { Component } from 'react';
import { connect } from "react-redux";
import { Icon,
			Collapse,
			Layout,
			List,
			Select,
			Divider,
			Button,
			Tooltip,
			Tag,
			Table,
			InputNumber
 } from 'antd';
import { updateTestcases } from "../../actions/endpoint-viewer";
const Store = require('electron-store');
const fs = require('fs');
const generateTestcases = require('../EndpointViewer/TestcaseGenerator');
const { Header, Content, Footer, Sider } = Layout;
const Panel = Collapse.Panel;
const Option = Select.Option;

const mapStateToProps = state => {
	return {
		endpoint: state.current_endpoint_reducer.current_endpoint.endpoint
	};
};

const mapDispatchToProps = dispatch => {
	return {
		updateTestcases: update => dispatch(updateTestcases(update))
	};
};

const columns = [{
	title: 'Parameter',
	dataIndex: 'parameter',
	key: 'parameter',
  }, {
	title: 'Type',
	dataIndex: 'type',
	key: 'type',
  }, {
	title: 'Value',
	dataIndex: 'value',
	key: 'value',
  }];

const toolTipStyle = {
	position: "absolute",
	float: "right",
}

const buttonContainerStyle = {
	textAlign: "right",
}

const dividerStyle = {
	margin: "8px 8px 8px 4px",
	padding: "0px 0px 0px 0px",
}

const buttonStyle = {
	margin: "2px 2px 2px 2px",
	padding: "0px 0px 0px 0px",
}

const style = {
	padding: "4px 8px 4px 8px",
	background: "#FFFFFF",
}


class ConnectedTestcase extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			key: props.key,
			disabled: true
		};


		this.handleChange = this.handleChange.bind(this);
		this.renderParameters = this.renderParameters.bind(this);
		this.renderOutputs = this.renderOutputs.bind(this);
		this.handleDeleteClicked = this.handleDeleteClicked.bind(this);
	}

	handleChange(value) {
	}

	handleDeleteClicked = (e) => {
		let testcase = this.props.testcase;
		let endpoint = this.props.endpoint;

    let tefPath = endpoint.tefPath;
    let tef = JSON.parse(fs.readFileSync(tefPath, 'utf8'));
    let tefTestcases = tef.testcases;

		let storeCwd = endpoint.tefPath.substring(0, endpoint.tefPath.indexOf(endpoint.name + '.tef') - 1);
		let store = new Store({
			name: endpoint.name,
			cwd: storeCwd,
			fileExtension: "tef"
		});

		for(let i = 0; i < tefTestcases.length; i++) {
			let tefTestcase = tefTestcases[i];
			if(tefTestcase.testcaseName == testcase.name) {
				tefTestcases.splice(i, 1);
				break;
			}
		}

		store.set('testcases', tefTestcases);
		generateTestcases(endpoint, tefTestcases);
		this.props.updateTestcases(true);
		this.props.updateTestcases(false);
	}

	renderParameters(testcase) {
		return(
			<Table dataSource={testcase.parameters} columns={columns} pagination={false} />
		);
	}

	renderOutputs(testcase) {
		return(
			<Table dataSource={testcase.expectedValues} columns={columns} pagination={false} />
		);
	}

	render() {
		const { testcase } = this.props;
		return (
			<Panel className="testcase_panel" {...this.props} header={testcase.name}>
				<div style={style}>
					<Layout style={{ backgroundColor: '#FFFFFF', padding: "0px 0px 0px 0px"}} hasSider="true">
						<Content style={{ backgroundColor: '#FFFFFF', padding: "0px 0px 0px 0px"}}>
						<Divider style={dividerStyle} orientation="left" >Request Type | Expected Response Code</Divider>
						  <Select
								showSearch
								style={{ width: 120 }}
								placeholder="Select a request type"
								optionFilterProp="children"
								onChange={this.handleChange}
								defaultValue={testcase.requestType}
								filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								disabled={this.state.disabled}
						  >
								<Option value="POST">POST</Option>
								<Option value="GET">GET</Option>
								<Option value="PUT">PUT</Option>
								<Option value="PATCH">PATCH</Option>
								<Option value="DELETE">DELETE</Option>
						  </Select>
						  <Divider type='vertical'></Divider>
						  <InputNumber min={1} max={1000} disabled={this.state.disabled} defaultValue={testcase.expectedResponseCode} />
						  <Divider type='vertical'></Divider>
						  <Divider style={dividerStyle} orientation="left"></Divider>
						  <Collapse bordered={false}>
							<Panel header="Query Parameters">
								{this.renderParameters(testcase)}
							</Panel>
							<Panel header="Expected Values">
								{this.renderOutputs(testcase)}
							</Panel>
						  </Collapse>
						  <div style={{marginBottom: "8px"}} />
						</Content>
						<Sider theme="light" width="36px" style={{ borderLeft: '1px solid #F1F2F6'  }}>
						<div style={buttonContainerStyle}>
							<Button style={buttonStyle} onClick={this.handleDeleteClicked} type="default" shape="circle" icon="delete" size="small" />
						</div>
						</Sider>
					</Layout>
				</div>
			</Panel>
		);
	}

}

const Testcase = connect(mapStateToProps, mapDispatchToProps)(ConnectedTestcase);

export default Testcase;
