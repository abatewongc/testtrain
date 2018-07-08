import React, { Component } from 'react';
import { Divider, Button, Modal, Form, Row, Input, Col, Select } from 'antd';
import { connect } from "react-redux";
import { loadEndpoint, clearEndpoint, editEndpoint } from "../../actions/endpoint-viewer";
import MenuBuilder from '../../menu.js';
import TestResultViewer from '../TestResultViewer/TestResultViewer';
import styles from './EndpointViewer.css';
import path from 'path';
const Store = require('electron-store');
const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const Option = Select.Option;
const fs = require('fs');

const mapStateToProps = state => {
		return {
			endpoint: state.current_endpoint_reducer.current_endpoint.endpoint,
			edit: state.current_endpoint_reducer.edit_endpoint
		};
};

const mapDispatchToProps = dispatch => {
		return {
			loadEndpoint: endpoint => dispatch(loadEndpoint(endpoint)),
			clearEndpoint: endpoint => dispatch(clearEndpoint(endpoint)),
			editEndpoint: edit => dispatch(editEndpoint(edit))
		};
};

class ConnectedEndpointViewer extends React.Component {
		constructor() {
				super();

				this.state = {
					endpoint: '',
					generatorVisible: false,
					reportViewerVisible: false,
					requestType: 'GET'
				};

				this.generateClicked = this.generateClicked.bind(this);
				this.editClicked = this.editClicked.bind(this);
				this.deleteClicked = this.deleteClicked.bind(this);
				this.uploadClicked = this.uploadClicked.bind(this);
				this.runClicked = this.runClicked.bind(this);
				this.viewClicked = this.viewClicked.bind(this);
				this.renderGenerator = this.renderGenerator.bind(this);
				this.renderParameters = this.renderParameters.bind(this);
				this.toggleGeneratorModal = this.toggleGeneratorModal.bind(this);
				this.submitTestcase = this.submitTestcase.bind(this);
				this.onRequestTypeChange = this.onRequestTypeChange.bind(this);
				this.toggleReportViewerModal = this.toggleReportViewerModal.bind(this);
			}

		toggleGeneratorModal = (generatorVisible) => {
			this.setState({generatorVisible});
		}

		submitTestcase = (generatorVisible, endpoint) => {
			//Get Form Item values
			let formItems = document.getElementById('testcaseForm').elements;
			console.log(formItems);
			let tef = JSON.parse(fs.readFileSync(endpoint.tefPath, 'utf8'));
			let testcases = tef.testcases;

			//Create testcase JSON
			let testcase = {
				testcaseName: formItems.testcaseName.value,
				testcaseInformation: {
					successCode: formItems.successCode.value,
					failCode: formItems.failCode.value,
					parameters: {}
				}
			}
			
			//Request type is not part of form items so get it from state instead
			testcase.testcaseInformation['requestType'] = this.state.requestType;

			//Add parameters to testcase JSON
			for(let i = 0; i < formItems.length; i++) {
				let id = formItems[i].id;
				let value = formItems[i].value;
				if(id != 'testcaseName' && id != 'successCode' && id != 'failCode') {
					testcase.testcaseInformation.parameters[id] = value;
				}
			}

			//Add testcase to testcases
			testcases.push(testcase);

			//Create new store
			let storeCwd = endpoint.tefPath.substring(0, endpoint.tefPath.indexOf(endpoint.name + '.tef') - 1);
			let store = new Store({
				name: endpoint.name,
				cwd: storeCwd,
				fileExtension: "tef"
			});

			store.set('testcases', testcases);

			this.setState({generatorVisible});
		}

		onRequestTypeChange(value, option) {
			let requestType = option.props.value;
			this.setState({requestType: requestType});
		}

		toggleReportViewerModal = (reportViewerVisible) => {
			this.setState({reportViewerVisible});
		}

		generateClicked = (e) => {
			this.toggleGeneratorModal(!this.state.generatorVisible);
		}

		runClicked = (e) => {
			console.log(e);
		}

		viewClicked = (e) => {
			this.toggleReportViewerModal(!this.state.reportViewerVisible);
		}

		editClicked = (e) => {
				if(this.props.edit) {
					this.props.editEndpoint(false);
				} else {
					this.props.editEndpoint(true);
				}
		}

		deleteClicked = (e) => {
				e.preventDefault();
				this.props.clearEndpoint({endpoint});
		}

		uploadClicked = (e) => {
				console.log(e);
		}

		renderParameters(endpoint, formItemLayout) {
			let testItems = [];
			endpoint.data.testItems.forEach(testItem => {
				testItems.push(
					<Row>
						<Col span={24}>
							<FormItem {...formItemLayout} label={testItem.parameter + '(' + testItem.type + ')'} style={{marginRight: 6}}>
								<Input id={testItem.parameter} type="text" />
							</FormItem>
						</Col>
					</Row>
				);
			});
			return testItems;
		}

		renderGenerator(endpoint) {
			const formItemLayout = {
				labelCol: { span: 6 },
				wrapperCol: { span: 18 }
			};
			return(
	      <div id="modalRoot">
	        <Form id="testcaseForm">
						<Row>
		          <Col span={24}>
		            <FormItem {...formItemLayout} label="Testcase Name" style={{marginRight: 6}}>
		              <Input id="testcaseName" type="text" />
		            </FormItem>
		          </Col>
						</Row>
						<Row>
							<Col span={24}>
								<FormItem {...formItemLayout} label="Request Type" style={{marginRight: 6}}>
									<Select id="testcaseRequestType" defaultValue="GET" onSelect={this.onRequestTypeChange}>
		                <Option value="GET">GET</Option>
										<Option value="POST">POST</Option>
										<Option value="PUT">PUT</Option>
										<Option value="DELETE">DELETE</Option>
		              </Select>
								</FormItem>
							</Col>
						</Row>
						{this.renderParameters(endpoint, formItemLayout)}
		        <Row>
		          <Col span={24}>
		            <FormItem {...formItemLayout} label="Success Response Code" style={{marginRight: 6}}>
		              <Input id="successCode" type="text" defaultValue={endpoint.data.successCode} />
		            </FormItem>
		          </Col>
		        </Row>
		        <Row>
		          <Col span={24}>
		            <FormItem {...formItemLayout} label="Fail Response Code" style={{marginRight: 6}}>
		              <Input id="failCode" type="text" defaultValue={endpoint.data.failCode} />
		            </FormItem>
		          </Col>
		        </Row>
	        </Form>
	      </div>
			)
		}

		render() {
				const {endpoint} = this.props;
				const bodyStyle = {
					width: '65vh',
				}

				const disabled = (endpoint === undefined || endpoint.disabled); // dunno how to set default props lul
				if(disabled) {
					return (
						<div>
						<div>You have nothing selected. (mongoloid)</div>
						</div>
					)
				} else {
					return (
							<div style={{paddingLeft: 12, paddingTop: '4px', paddingBottom: '0px', textAlign: 'left', overflow: 'auto', height: '100%', lineHeight: 1.1}}>
									<p className="margin-0" id="endpoint_display_title">{endpoint.name.replace(new RegExp('&', 'g'), '/')}</p>
									<div className={styles.buttonMenu} id="endpoint_display_path" >
									<ButtonGroup size="small">
											<Button type="primary" size="small" onClick={this.generateClicked}>Generate</Button>
											<Modal
													title="Generate Testcase"
													style={{ top: 20 }}
													visible={this.state.generatorVisible}
													onOk={() => this.submitTestcase(false, endpoint)}
													onCancel={() => this.toggleGeneratorModal(false)}
													bodyStyle={{ bodyStyle }}
													destroyOnClose = {true}
													width='80%'
													okText='Submit'
												>
													{this.renderGenerator(endpoint)}
												</Modal>
											<Button size="small" onClick={this.editClicked}>Edit</Button>
											<Button size="small" onClick={this.deleteClicked}>Delete</Button>
									</ButtonGroup>
									<Divider style={{margin: "2px 8px 2px 8px" }}type='vertical'></Divider>
									<ButtonGroup size="small">
											<Button type="primary" size="small" onClick={this.runClicked}>Run</Button>
											<Button size="small" onClick={this.viewClicked}>View</Button>
											<Modal
													title="Report Viewer"
													style={{ top: 20 }}
													visible={this.state.reportViewerVisible}
													onOk={() => this.toggleReportViewerModal(false)}
													onCancel={() => this.toggleReportViewerModal(false)}
													bodyStyle={{bodyStyle}}
													destroyOnClose = {true}
													width='65%'
													footer={null}
											>
													<TestResultViewer endpoint={endpoint} />
											</Modal>
											<Button size="small" onClick={this.uploadClicked} disabled="true">Upload</Button>
									</ButtonGroup>
									</div>
							</div>
					);
				}
		}
}



const EndpointViewer = connect(mapStateToProps, mapDispatchToProps)(ConnectedEndpointViewer);

export default EndpointViewer;
