import React, { Component } from 'react';
import { Divider, Button, Modal, Form, Row, Input, Col, Select, Radio, notification } from 'antd';
import { connect } from "react-redux";
import { loadEndpoint, clearEndpoint, editEndpoint, updateTestcases } from "../../actions/endpoint-viewer";
import MenuBuilder from '../../menu.js';
import TestResultViewer from '../TestResultViewer/TestResultViewer';
import styles from './EndpointViewer.css';
import path from 'path';
const generateTestcases = require('./TestcaseGenerator');
const Store = require('electron-store');
const fs = require('fs');
const util = require('util');
const spawn = require('child_process').spawn;
const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const OptGroup = Select.OptGroup;
var rimraf = require('rimraf');
const remote = require('electron').remote;

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
			editEndpoint: edit => dispatch(editEndpoint(edit)),
			updateTestcases: update => dispatch(updateTestcases(update))
		};
};

class ConnectedEndpointViewer extends React.Component {
		constructor() {
				super();

				this.state = {
					endpoint: '',
					generatorVisible: false,
					runnerVisible: false,
					reportViewerVisible: false,
					requestType: 'GET',
					running: false,
					generating: false,
					testToRun: '',
					testrunName: '',
					autoname: false,
					isArrayResponse: true,
					saveResults: true,
					showCode: false,
					reporterOptions: [],
					disableForms: false,
					expectedResponseProperties: [{parameter: '', type: 'Number', value: ''}]
				};

				this.generateClicked = this.generateClicked.bind(this);
				this.editClicked = this.editClicked.bind(this);
				this.deleteClicked = this.deleteClicked.bind(this);
				this.uploadClicked = this.uploadClicked.bind(this);
				this.runClicked = this.runClicked.bind(this);
				this.viewClicked = this.viewClicked.bind(this);
				this.renderGenerator = this.renderGenerator.bind(this);
				this.renderParameters = this.renderParameters.bind(this);
				this.renderRunner = this.renderRunner.bind(this);
				this.handleChange = this.handleChange.bind(this);
				this.handleTestcaseSelection = this.handleTestcaseSelection.bind(this);
				this.handleGeneratorCancel = this.handleGeneratorCancel.bind(this);
				this.handleRunnerCancel = this.handleRunnerCancel.bind(this);
				this.onSuccessCodeClick = this.onSuccessCodeClick.bind(this);
				this.onFailureCodeClick = this.onFailureCodeClick.bind(this);
				this.handleAddResponseProperty = this.handleAddResponseProperty.bind(this);
				this.handleRemoveResponseProperty = this.handleRemoveResponseProperty.bind(this);
				this.handleReporterOptions = this.handleReporterOptions.bind(this);
				this.submitTestcase = this.submitTestcase.bind(this);
				this.runTest = this.runTest.bind(this);
				this.disableTestrunName = this.disableTestrunName.bind(this);
				this.setRunningState = this.setRunningState.bind(this);
				this.onRequestTypeChange = this.onRequestTypeChange.bind(this);
				this.onArrayResponseChange = this.onArrayResponseChange.bind(this);
				this.onSaveResultsChange = this.onSaveResultsChange.bind(this);
				this.onShowCodeChange = this.onShowCodeChange.bind(this);
				this.toggleReportViewerModal = this.toggleReportViewerModal.bind(this);
				this.handleNullSelectionButtonClick = this.handleNullSelectionButtonClick.bind(this);
			}

		handleGeneratorCancel = () => {
			this.setState({generatorVisible: false});
		}

		handleRunnerCancel = () => {
			this.setState({runnerVisible: false});
		}

		onSuccessCodeClick = () => {
			let expectedResponseCode = document.getElementById('expectedResponseCode');
			expectedResponseCode.value = this.props.endpoint.data.successCode;
		}

		onFailureCodeClick = () => {
			let expectedResponseCode = document.getElementById('expectedResponseCode');
			expectedResponseCode.value = this.props.endpoint.data.failCode;
		}

		onArrayResponseChange = (event) => {
			this.setState({isArrayResponse: event.target.value});
		}

		onSaveResultsChange = (event) => {
			this.setState({saveResults: event.target.value});
		}

		onShowCodeChange = (event) => {
			this.setState({showCode: event.target.value});
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
			let newArray = this.state.expectedResponseProperties;
			newArray.push({parameter: '', type: 'Number', value: ''});
	    this.setState({
	      expectedResponseProperties: newArray
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
			let formFailure = false;

			for(let i = 0; i < testcases.length; i++) {
				let testcase = testcases[i];
				if(testcase.testcaseName == formItems.testcaseName.value) {
					 notification['error']({
						 message: 'Form Validation Error',
						 description: 'There is already a testcase with the name' + formItems.testcaseName.value
					 });
					 return;
				}
			}

			//Create testcase JSON
			let testcase = {
				testcaseName: formItems.testcaseName.value,
				testcaseInformation: {
					expectedResponseCode: formItems.expectedResponseCode.value,
					isArray: this.state.isArrayResponse,
					parameters: [],
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
					let parameter = {};
					tef.testItems.forEach(testItem => {
						if(testItem.parameter == id) {
							parameter = testItem;
						}
					});
					parameter.value = value;
					testcase.testcaseInformation.parameters.push(parameter);
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

			this.setState({generating: true});

	    //Get root and remove everything
	    let root = document.getElementById('generatorModalRoot');
			while(root.firstChild) {
				root.removeChild(root.firstChild);
			}

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

			this.props.updateTestcases(true);
			this.props.updateTestcases(false); //Set to false after true to reset state
			this.handleGeneratorCancel(false);
			this.setState({generating: false});
			this.forceUpdate();
		}

		runTest = () => {
			let endpoint = this.props.endpoint;
			let tef = JSON.parse(fs.readFileSync(endpoint.tefPath, 'utf8'));
			//Save reports in a endpoint specific directory, append to path

			let homeDir = new Store().get('testcase_datastorage_local');
	    let projectDir = path.join(homeDir, endpoint.projectName);
			let testReportsDirectory = path.join(projectDir, 'mochawesome-report', endpoint.name);
	    let options = {
	      cwd: projectDir
	    }

			if(this.state.testToRun == '') {
				notification['error']({
					'message': 'Form Validation Error',
					'description': 'Please choose a test to run.'
				});
				return;
			}

			if(this.state.testrunName == '') {
				if(!this.state.autorun && this.state.saveResults) {
					notification['error']({
						'message': 'Form Validation Error',
						'description': 'Please put a testrun name or set reporter options to "Autoname Testrun"'
					});
					return;
				}
			}

			let clArguments = ['node_modules/mocha/bin/mocha', '--recursive'];

			if(this.state.saveResults) {
				clArguments.push('--reporter', 'mochawesome')

				if(this.state.reporterOptions.length > 0) {
					clArguments.push('--reporter-options');

					let reporterOptions = 'reportDir=' + testReportsDirectory + ',reportFilename=' + this.state.testrunName +',';
					if(this.state.autoname) {
						reporterOptions = 'reportDir=' + testReportsDirectory + ',reportFilename=' + this.state.testToRun +',';
					}
					this.state.reporterOptions.forEach(reporterOption => {
						switch(reporterOption) {
							case 'hideChart':
								console.log(reporterOption);
								reporterOptions += 'charts=false,';
								break;
							case 'hideCode':
								reporterOptions += 'code=false,';
								break;
							case 'autoOpen':
								reporterOptions += 'autoOpen=true,';
								break;
							case 'addTimestamp':
								reporterOptions += 'timestamp,';
								break;
							case 'hidePassed':
								reporterOptions += 'showPassed=false,';
								break;
							case 'hideFailed':
								reporterOptions += 'showFailed=false,';
								break;
							case 'showSkipped':
								reporterOptions += 'showSkipped=true,';
								break;
							case 'saveJson':
								reporterOptions += 'saveJson=true,';
								break;
						}
					});
					if(reporterOptions.endsWith(',')) {
						reporterOptions = reporterOptions.substring(0, reporterOptions.length - 1);
					}
					clArguments.push(reporterOptions);
				}
			}

			if(this.state.testToRun != 'RUN_ALL_TESTS') {
				clArguments.push('--grep', this.state.testToRun);
			}

			let child = spawn('node', clArguments, options);

			this.setState({running: true});

	    //Get root and remove everything
	    let root = document.getElementById('runnerModalRoot');
			while(root.firstChild) {
				root.removeChild(root.firstChild);
			}

	    //Create spinner div to center
	    let spinDiv = document.createElement('div');
	    spinDiv.className = styles.center;

	    //Create loading spinner
	    let spinner = document.createElement('div');
	    spinner.className = 'ant-spin ant-spin-spinning';

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

			let toggleRunnerModal = this.toggleRunnerModal;
			let setRunningState = this.setRunningState;
			if(this.state.autoname) {
				this.setState({autoname: false});
			}
			child.on('close', function(code) {
				toggleRunnerModal(false);
				setRunningState(false);
			});
		}

		setRunningState(value) {
			this.setState({running: value});
		}

		setAutoname(value) {
			this.setState({autoname: value});
		}

		onRequestTypeChange(value, option) {
			let requestType = option.props.value;
			this.setState({requestType: requestType});
		}

		handleTestcaseSelection(value, option) {
			let testToRun = option.props.value;
			this.setState({testToRun: testToRun});
		}

		handleChange(event) {
			switch(event.target.id) {
				case 'testrunName':
					this.setState({testrunName: event.target.value});
			}
		}

		handleReporterOptions(value) {
			if(value.indexOf('autoname') > -1) {
				this.setState({autoname: true});
				this.setState({testrunName: ''});
			} else {
				if(this.state.autoname) {
					this.setState({autoname: false});
				}
			}
			this.setState({reporterOptions: value});
		}

		toggleReportViewerModal = (reportViewerVisible) => {
			this.setState({reportViewerVisible});
		}

		toggleRunnerModal = (runnerVisible) => {
			this.setState({runnerVisible});
		}

		generateClicked = (e) => {
			this.setState({
				generatorVisible: true,
				expectedResponseProperties: [{parameter: '', type: 'Number', value: ''}],
				requestType: 'GET',
				isArrayResponse: true
			});
		}

		runClicked = (e) => {
			this.setState({
				runnerVisible: true,
				testrunName: '',
				testToRun: '',
				autoname: false
			});
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

		handleNullSelectionButtonClick = (e) => {
			let browserWindow = remote.getCurrentWindow()
			browserWindow.emit('add-new-endpoint');
		}

		deleteClicked = (e) => {
				e.preventDefault();
				let endpoint = this.props.endpoint;
				try {
					let tefPath = endpoint.tefPath;
					let endpointPath = path.join(endpoint.tefPath, "../")
					rimraf.sync(endpointPath);
				} catch(error) {
					// ignore this cuz im lazy and this isn't an enterprise app
				}

				this.props.clearEndpoint({endpoint});

		}

		disableTestrunName() {
			if(this.state.autoname) {
				return true;
			} else if(!this.state.saveResults) {
				return true;
			} else {
				return false;
			}
		}

		uploadClicked = (e) => {
				console.log(e);
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
	      <div id="generatorModalRoot">
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
									<RadioGroup onChange={this.onArrayResponseChange} value={this.state.isArrayResponse}>
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
			);
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

		renderRunner(endpoint) {
			const formItemLayout = {
				labelCol: { span: 6 },
				wrapperCol: { span: 18 }
			};

			return(
				<div id="runnerModalRoot">
					<div className="ant-modal-header">
						<div className="ant-modal-title">Run Options</div>
					</div>
					<br />
					<Form id="runnerForm">
						<Row>
							<Col span={24}>
								<FormItem {...formItemLayout} label="Test to Run" style={{marginRight: 6}}>
									<Select
										showArrow
										showSearch
										placeholder="Select a Test"
										optionFilterProp="children"
										onChange={this.handleTestcaseSelection}
										filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									>
										{this.renderOptions(endpoint)}
									</Select>
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								<FormItem {...formItemLayout} label="Save Results">
									<RadioGroup onChange={this.onSaveResultsChange} value={this.state.saveResults}>
										<Radio value={true}>yes</Radio>
										<Radio value={false}>no</Radio>
									</RadioGroup>
								</FormItem>
							</Col>
						</Row>
					</Form>
					<div className="ant-modal-header">
						<div className="ant-modal-title">Reporter Options</div>
					</div>
					<br />
					<Form id="reporterForm">
						<Row>
							<Col span={24}>
								<FormItem {...formItemLayout} label="Testrun Name" style={{marginRight: 6}}>
									<Input id="testrunName" type="text" value={this.state.testrunName} onChange={this.handleChange} disabled={this.disableTestrunName()}/>
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								<Select
									showSearch
									optionFilterProp="children"
									mode="multiple"
									placeholder="Additional Options"
									onChange={this.handleReporterOptions}
									filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									disabled={!this.state.saveResults}
								>
									<Option key="hideChart" value="hideChart">Hide Charts</Option>
									<Option key="hideCode" value="hideCode">Hide Code</Option>
									<Option key="autoOpen" value="autoOpen">Open After Run</Option>
									<Option key="addTimestamp" value="addTimestamp">Add ISO Timestamp to Name</Option>
									<Option key="hidePassed" value="hidePassed">Hide Passed</Option>
									<Option key="hideFailed" value="hideFailed">Hide Failed</Option>
									<Option key="showSkipped" value="showSkipped">Show Skipped</Option>
									<Option key="saveJson" value="saveJson">Save JSON</Option>
									<Option key="autonName" value="autoname">Autoname Testrun</Option>
								</Select>
							</Col>
						</Row>
					</Form>
				</div>
			);
		}

		renderOptions(endpoint) {
			let endpointName = endpoint.name.replace(new RegExp('&', 'g'), '/');
			let tef = JSON.parse(fs.readFileSync(endpoint.tefPath, 'utf8'));
			let testcases = tef.testcases;

			let gets = ['GET', 'GET ' + endpointName];
			let posts = ['POST', 'POST ' + endpointName];
			let puts = ['PUT', 'PUT ' + endpointName];
			let deletes = ['DELETE', 'DELETE ' + endpointName];

			testcases.forEach(testcase => {
				switch(testcase.testcaseInformation.requestType) {
					case 'GET':
						gets.push(testcase.testcaseName);
						break;
					case 'POST':
						posts.push(testcase.testcaseName);
						break;
					case 'PUT':
						puts.push(testcase.testcaseName);
						break;
					case 'DELETE':
						deletes.push(testcase.testcaseName);
						break;
				}
			});

			let options = [];

			options.push(
				<OptGroup label="All">
					<Option value="RUN_ALL_TESTS">All</Option>
				</OptGroup>
			);
			if(gets.length != 2) {
				options.push(
					<OptGroup label="GET">
						{gets.map((testcase) => <Option key={testcase.testcaseName} value={testcase}>{testcase}</Option>)}
					</OptGroup>
				);
			}
			if(posts.length != 2) {
				options.push(
					<OptGroup label="POST">
						{posts.map((testcase) => <Option key={testcase.testcaseName} value={testcase}>{testcase}</Option>)}
					</OptGroup>
				);
			}
			if(puts.length != 2) {
				options.push(
					<OptGroup label="PUT">
						{puts.map((testcase) => <Option key={testcase.testcaseName} value={testcase}>{testcase}</Option>)}
					</OptGroup>
				);
			}
			if(deletes.length != 2) {
				options.push(
					<OptGroup label="DELETE">
						{deletes.map((testcase) => <Option key={testcase.testcaseName} value={testcase}>{testcase}</Option>)}
					</OptGroup>
				);
			}

			return options;
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
							<div>
							<Button
                			    type="primary"
                			    icon="plus"
                			    size="default"
								onClick={this.handleNullSelectionButtonClick}
								disabled={false}
							>
								Make New Endpoint
							</Button>
							</div>
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
													destroyOnClose={true}
													width='80%'
													footer={[
														<Button key="addResponseProperty" onClick={this.handleAddResponseProperty} disabled={this.state.generating}>Add Response Property</Button>,
														<Button key="exitGenerator" onClick={this.handleGeneratorCancel} disabled={this.state.generating}>Cancel</Button>,
														<Button key="submitTestcase" onClick={this.submitTestcase} disabled={this.state.generating}>Submit</Button>
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
											<Modal
												title="Test Runner"
												style={{ top: 20 }}
												visible={this.state.runnerVisible}
												bodyStyle={{ bodyStyle }}
												onOk={this.runTest}
												onCancel={this.handleRunnerCancel}
												destroyOnClose={true}
												width='60%'
												footer={[
													<Button key="exitRunner" onClick={this.handleRunnerCancel} disabled={this.state.running}>Cancel</Button>,
													<Button key="run" onClick={this.runTest} disabled={this.state.running}>Run</Button>
												]}
											>
												{this.renderRunner(endpoint)}
											</Modal>
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
