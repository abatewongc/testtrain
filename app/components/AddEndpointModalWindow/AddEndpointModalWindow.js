// eslint-disable class-methods-use-this
import React, { Component } from 'react';
import styles from './AddEndpointModalWindow.css'
import { Form, Row, Input, Button, Col, Select } from 'antd';
const {dialog} = require('electron').remote;
const Store = require('electron-store');
const path = require('path');
const dirTree = require('directory-tree');
const remote = require('electron').remote;
const FormItem = Form.Item;
const Option = Select.Option;
const fs = require('fs');

export default class CreateProjectModalWindow extends Component {
  constructor() {
    super();
    this.state = {
			endpoint: '',
      project: 'Please Select a Project',
      testItems: [{ parameter: '', type: 'number'}],
      successCode: '',
      failCode: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTestParameter = this.handleTestParameter.bind(this);
    this.handleTestType = this.handleTestType.bind(this);
    this.handleAddTestItem = this.handleAddTestItem.bind(this);
    this.handleRemoveTestItem = this.handleRemoveTestItem.bind(this);
    this.createSelectItems = this.createSelectItems.bind(this);
    this.onDropdownSelected = this.onDropdownSelected.bind(this);
  }

  handleChange(event) {
		switch(event.target.id) {
			case 'endpoint':
				this.setState({endpoint: event.target.value});
				break;
      case 'successCode':
        this.setState({successCode: event.target.value});
        break;
      case 'failCode':
        this.setState({failCode: event.target.value});
        break;
		}
  }

  handleTestParameter = (idx) => (event) => {
    const newTestItems = this.state.testItems.map((testItem, sidx) => {
      if(idx !== sidx) {
        return testItem;
      } else {
        return {...testItem, parameter: event.target.value};
      }
    });

    this.setState({testItems: newTestItems});
  }

  handleTestType = (idx) => (value, option) => {
    let type = option.props.value;
    const newTestItems = this.state.testItems.map((testItem, sidx) => {
      if(idx !== sidx) {
        return testItem;
      } else {
        return {...testItem, type: type};
      }
    });

    this.setState({testItems: newTestItems});
  }

  handleAddTestItem = () => {
    let browserWindow = remote.getCurrentWindow();
    let windowSize = remote.getCurrentWindow().getSize();
    if(windowSize[1] < 600) {
      browserWindow.setSize(windowSize[0], windowSize[1] + 60);
    }

    this.setState({
      testItems: this.state.testItems.concat([{ parameter: '', type: 'number'}])
    });
  }

  handleRemoveTestItem = (idx) => () => {
    let browserWindow = remote.getCurrentWindow();
    let windowSize = remote.getCurrentWindow().getSize();
    if(windowSize[1] > 340) {
      browserWindow.setSize(windowSize[0], windowSize[1] - 60);
    }

    this.setState({
      testItems: this.state.testItems.filter((s, sidx) => idx !== sidx)
    });
  }

  createSelectItems() {
    let items = [];
    let projects = dirTree(new Store().get('testcase_datastorage_local'), {extensions:/\.tpf$/, exclude:/node_modules/}).children;
    items.push(<Option value="Please Select a Project">Please Select a Project</Option>);
    for(let i = 0; i < projects.length; i++) {
      let projectName = projects[i].name;
      items.push(<Option value={projectName}>{projectName}</Option>);
    }
    return items;
  }

  onDropdownSelected(value, option) {
    let project = option.props.value;
    this.setState({project: project});
  }

  handleSubmit(event) {
    event.preventDefault();

    let projectName = this.state.project;
    let endpoint = this.state.endpoint;
    let testItems = this.state.testItems;
    let successCode = this.state.successCode;
    let failCode = this.state.failCode;

    if(projectName == 'Please Select a Project') {
      alert('Please Select a Project');
    } else {
      let projects = dirTree(new Store().get('testcase_datastorage_local'), {extensions:/\.tpf$/, exclude:/node_modules/}).children;
      projects.forEach(function(project) {
        if(project.name == projectName) {
          let fileName = endpoint.replace(new RegExp('/', 'g'), '&');
          let tpfPath = path.join(project.path, project.name + '.tpf');
          let testPath = path.join(project.path, 'test', fileName);
          let reportPath = path.join(project.path, 'mochawesome-report', fileName);
          fs.mkdirSync(reportPath);
          let store = new Store({
            name: fileName,
            cwd: testPath,
            fileExtension: "tef"
          });

          store.set('testItems', testItems);
          store.set('successCode', successCode);
          store.set('failCode', failCode);
          store.set('testcases', []);
          store.set('tpfPath', tpfPath);

          let window = remote.getCurrentWindow();
          window.close();
        }
      })
    }
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    };

    const testItemLayout = {
      labelCol: { span: 12 },
      wrapperCol: { span: 12 }
    };
    const typeBool = "Boolean";
    const typeString = "String";
    const typeNumber = "Number";

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayout} label="Endpoint" style={{marginRight: 6}}>
              <Input id="endpoint" type="text" value={this.state.endpoint} onChange={this.handleChange} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayout} label="Project" style={{marginRight: 6}}>
              <Select defaultValue={this.state.project} onSelect={this.onDropdownSelected}>
                {this.createSelectItems()}
              </Select>
            </FormItem>
          </Col>
        </Row>
        {this.state.testItems.map((testItem, idx) => (
          <Row>
            <Col span={10}>
              <FormItem {...testItemLayout} label="Parameter">
                <Input type="text" value={testItem.parameter} onChange={this.handleTestParameter(idx)} />
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem {...testItemLayout} label="Type">
                <Select type="text" value={testItem.type} onChange={this.handleTestType(idx)}>
                  <Option value={typeNumber}>{typeNumber}</Option>
                  <Option value={typeString}>{typeString}</Option>
                  <Option value={typeBool}>{typeBool}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={4}>
              <Button onClick={this.handleRemoveTestItem(idx)} className={styles.button}>-</Button>
            </Col>
          </Row>
        ))}
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayout} label="Success Response Code" style={{marginRight: 6}}>
              <Input id="successCode" type="text" value={this.state.successCode} onChange={this.handleChange} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayout} label="Fail Response Code" style={{marginRight: 6}}>
              <Input id="failCode" type="text" value={this.state.failCode} onChange={this.handleChange} />
            </FormItem>
          </Col>
        </Row>
        <Row style={{marginBottom: 8}}>
          <Button type="primary" htmlType="submit" onClick={this.handleSubmit} className={styles.button}>Submit</Button>
          <Button onClick={this.handleAddTestItem} className={styles.button}>Add Parameter</Button>
          <Button onClick={this.test} className={styles.button}>Test</Button>
        </Row>
			</Form>
    );
  }
}
