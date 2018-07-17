import React, { Component } from 'react';
import { Divider, Button, Modal, Form, Row, Input, Col, Select, Radio } from 'antd';
import { connect } from "react-redux";
import { loadEndpoint, clearEndpoint, editEndpoint } from "../../actions/endpoint-viewer";
import MenuBuilder from '../../menu.js';
import TestResultViewer from '../TestResultViewer/TestResultViewer';
import styles from './EndpointViewer.css';
import path from 'path';
const generateTestcases = require('./TestcaseGenerator');
const Store = require('electron-store');
const fs = require('fs');
const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;

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
					requestType: 'GET',
					radioOption: true,
					expectedResponseProperties: [{parameter: '', type: 'number', value: ''}]
				};

				this.generateClicked = this.generateClicked.bind(this);
				this.editClicked = this.editClicked.bind(this);
				this.deleteClicked = this.deleteClicked.bind(this);
				this.uploadClicked = this.uploadClicked.bind(this);
				this.runClicked = this.runClicked.bind(this);
				this.viewClicked = this.viewClicked.bind(this);
				this.renderGenerator = this.renderGenerator.bind(this);
				this.renderParameters = this.renderParameters.bind(this);
				this.handleGeneratorCancel = this.handleGeneratorCancel.bind(this);
				this.onSuccessCodeClick = this.onSuccessCodeClick.bind(this);
				this.onFailureCodeClick = this.onFailureCodeClick.bind(this);
				this.handleAddResponseProperty = this.handleAddResponseProperty.bind(this);
				this.handleRemoveResponseProperty = this.handleRemoveResponseProperty.bind(this);
				this.submitTestcase = this.submitTestcase.bind(this);
				this.onRequestTypeChange = this.onRequestTypeChange.bind(this);
				this.onRadioChange = this.onRadioChange.bind(this);
				this.toggleReportViewerModal = this.toggleReportViewerModal.bind(this);
			}

		handleGeneratorCancel = () => {
			this.setState({generatorVisible: false});
		}

		onSuccessCodeClick = () => {
			let expectedResponseCode = document.getElementById('expectedResponseCode');
			expectedResponseCode.value = this.props.endpoint.data.successCode;
		}

		onFailureCodeClick = () => {
			let expectedResponseCode = document.getElementById('expectedResponseCode');
			expectedResponseCode.value = this.props.endpoint.data.failCode;
		}

		onRadioChange = (event) => {
			this.setState({radioOption: event.target.value});
		}

	  handleResponseParameter = (idx) => (event) => {
	    const newTestItems = this.state.expectedResponseProperties.map((property, sidx) => {
	      if(idx !== sidx) {
	        return property;
	      } else {
	        return {...property, parameter: event.target.value};
	      }
	    });

	    this.setState({expectedResponseProperties: newTestItems});
	  }

	  handleParameterType = (idx) => (value, option) => {
	    let type = option.props.value;
	    const newTestItems = this.state.expectedResponseProperties.map((property, sidx) => {
	      if(idx !== sidx) {
	        return property;
	      } else {
	        return {...property, type: type};
	      }
	    });

	    this.setState({expectedResponseProperties: newTestItems});
	  }

	  handleParameterValue = (idx) => (event) => {
	    const newTestItems = this.state.expectedResponseProperties.map((property, sidx) => {
	      if(idx !== sidx) {
	        return property;
	      } else {
	        return {...property, value: event.target.value};
	      }
	    });

	    this.setState({expectedResponseProperties: newTestItems});
	  }

	  handleAddResponseProperty = () => {
	    this.setState({
	      expectedResponseProperties: this.state.expectedResponseProperties.concat([{ parameter: '', type: 'number', value: ''}])
	    });
	  }

	  handleRemoveResponseProperty = (idx) => () => {
	    this.setState({
	      expectedResponseProperties: this.state.expectedResponseProperties.filter((s, sidx) => idx !== sidx)
	    });
	  }

		submitTestcase = () => {
			//Get Form Item values
			let endpoint = this.props.endpoint;
			let formItems;
			if(document.getElementById('testcaseForm')) {
				formItems = document.getElementById('testcaseForm').elements;
			} else {
				return;
			}
			let tef = JSON.parse(fs.readFileSync(endpoint.tefPath, 'utf8'));
			let testcases = tef.testcases;

			//Create testcase JSON
			let testcase = {
				testcaseName: formItems.testcaseName.value,
				testcaseInformation: {
					expectedResponseCode: formItems.expectedResponseCode.value,
					isArray: this.state.radioOption,
					parameters: {},
					expectedValues: this.state.expectedResponseProperties
				}
			}

			//Request type is not part of form items so get it from state instead
			testcase.testcaseInformation['requestType'] = this.state.requestType;

			//Add parameters to testcase JSON
			for(let i = 0; i < formItems.length; i++) {
				let id = formItems[i].id;
				let value = formItems[i].value;
				if(id != 'testcaseName' && id != 'expectedResponseCode' && id && value) {
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

	    //Get root and remove everything
	    let root = document.getElementById('modalRoot');
	    root.removeChild(root.children[0]);

	    //Create spinner div to center
	    let spinDiv = document.createElement('div');
	    spinDiv.className = styles.center;

	    //Create loading spinner
	    let spinner = document.createElement('div');
	    spinner.className = 'ant-spin ant-spin-lg ant-spin-spinning';

	    //Creating the dots for the spinner
	    let spinSpan = document.createElement('span');
	    spinSpan.className = 'ant-spin-dot ant-spin-dot-spin';
	    for(let i = 0; i < 4; i++) {
	      spinSpan.appendChild(document.createElement('i'));
	    }

	    //Append loading spinner to root
	    spinner.appendChild(spinSpan);
	    spinDiv.appendChild(spinner);
	    root.appendChild(spinDiv);

			generateTestcases(endpoint, testcases);
			this.handleGeneratorCancel(false);
		}

		onRequestTypeChange(value, option) {
			let requestType = option.props.value;
			this.setState({requestType: requestType});
		}

		toggleReportViewerModal = (reportViewerVisible) => {
			this.setState({reportViewerVisible});
		}

		generateClicked = (e) => {
			this.setState({
				generatorVisible: true,
				expectedResponseProperties: [{parameter: '', type: 'number', value: ''}],
				requestType: 'GET',
				radioOption: true
			});
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
			const formItemLayoutResponse = {
				labelCol: { span: 8 },
				wrapperCol: { span: 14 }
			}
			const formItemLayoutRequest = {
				labelCol: { span: 12 },
				wrapperCol: { span: 12 }
			}
			const formItemLayoutArray = {
				labelCol: { span: 12 },
				wrapperCol: { span: 12 }
			}
	    const formItemResponeProperties = {
	      labelCol: { span: 10 },
	      wrapperCol: { span: 14 }
	    };
	    const typeBool = "Boolean";
	    const typeString = "String";
	    const typeNumber = "Number";

			return(
	      <div id="modalRoot">
					<div className="ant-modal-header">
						<div className="ant-modal-title">Basic Testcase Parameters</div>
					</div>
					<br />
	        <Form id="testcaseForm">
						<Row>
		          <Col span={24}>
		            <FormItem {...formItemLayout} label="Testcase Name" style={{marginRight: 6}}>
		              <Input id="testcaseName" type="text" />
		            </FormItem>
		          </Col>
						</Row>
						<Row>
							<Col span={12}>
								<FormItem {...formItemLayoutRequest} label="Request Type" style={{marginRight: 6}}>
									<Select id="testcaseRequestType" defaultValue="GET" onSelect={this.onRequestTypeChange}>
		                <Option value="GET">GET</Option>
										<Option value="POST">POST</Option>
										<Option value="PUT">PUT</Option>
										<Option value="DELETE">DELETE</Option>
		              </Select>
								</FormItem>
							</Col>
							<Col span={12}>
								<FormItem {...formItemLayoutArray} label="Array Response" style={{marginRight: 6}}>
									<RadioGroup onChange={this.onRadioChange} value={this.state.radioOption}>
										<Radio value={true}>yes</Radio>
										<Radio value={false}>no</Radio>
									</RadioGroup>
								</FormItem>
							</Col>
						</Row>
						{this.renderParameters(endpoint, formItemLayout)}
		        <Row>
		          <Col span={18}>
		            <FormItem {...formItemLayoutResponse} label="Expected Response Code" style={{marginRight: 6}}>
		              <Input id="expectedResponseCode" type="text" defaultValue={endpoint.data.successCode} />
		            </FormItem>
		          </Col>
							<Col span={3}>
								<Button type="primary" className={styles.button} onClick={this.onSuccessCodeClick}>Succeeds</Button>
							</Col>
							<Col span={3}>
								<Button type="danger" className={styles.button} onClick={this.onFailureCodeClick}>Fails</Button>
							</Col>
		        </Row>
	        </Form>
					<div className="ant-modal-header">
						<div className="ant-modal-title">Expect JSON Response Parameters</div>
					</div>
					<br />
					<Form id="expectedJsonResponseForm">
						{this.state.expectedResponseProperties.map((responseProperty, idx) => (
							<Row key={"Row_" + idx}>
								<Col span={6}>
									<FormItem {...formItemResponeProperties} label="Property">
										<Input type="text" value={responseProperty.parameter} onChange={this.handleResponseParameter(idx)} />
									</FormItem>
								</Col>
								<Col span={6}>
									<FormItem {...formItemResponeProperties} label="Type">
										<Select type="text" value={responseProperty.type} onChange={this.handleParameterType(idx)}>
											<Option value={typeNumber}>{typeNumber}</Option>
											<Option value={typeString}>{typeString}</Option>
											<Option value={typeBool}>{typeBool}</Option>
										</Select>
									</FormItem>
								</Col>
								<Col span={6}>
									<FormItem {...formItemResponeProperties} label="Value">
										<Input type="text" value={responseProperty.value} onChange={this.handleParameterValue(idx)} />
									</FormItem>
								</Col>
								<Col span={4}>
									<Button onClick={this.handleRemoveResponseProperty(idx)} className={styles.button}>-</Button>
								</Col>
							</Row>
						))}
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
													bodyStyle={{ bodyStyle }}
													onOk={this.submitTestcase}
													onCancel={this.handleGeneratorCancel}
													destroyOnClose = {true}
													width='80%'
													footer={[
														<Button key="add" onClick={this.handleAddResponseProperty}>Add Response Property</Button>,
														<Button key="back" onClick={this.handleGeneratorCancel}>Cancel</Button>,
														<Button key="submit" onClick={this.submitTestcase}>Submit</Button>
													]}
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
