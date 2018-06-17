// eslint-disable class-methods-use-this
import React, { Component } from 'react';
import { Form, Row, Input, Button, Col } from 'antd';
import styles from './CreateProjectModalWindow.css'
const {dialog} = require('electron').remote;
const Store = require('electron-store');
const path = require('path');
const remote = require('electron').remote;
const FormItem = Form.Item;

export default class CreateProjectModalWindow extends Component {
  constructor() {
    super();
    this.state = {
			projectName: '',
			apiURL: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
		switch(event.target.id) {
			case 'projectName':
				this.setState({projectName: event.target.value});
				break;
			case 'apiURL':
				this.setState({apiURL: event.target.value})
				break;
		}
  }

  handleSubmit(event) {
		event.preventDefault();
		console.log('A name was submitted: ' + this.state.projectName);
		let home_dir = new Store().get('testcase_datastorage_local')
		let store = new Store({
			name: this.state.projectName,
			cwd: path.join(home_dir, "\\", this.state.projectName),
			fileExtension: "tpf"
		})

		store.set('apiURL', this.state.apiURL)

		let window = remote.getCurrentWindow()
		window.close()
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    };

    return (
			<Form onSubmit={this.handleSubmit}>
        <Row>
          <Col>
  					<FormItem {...formItemLayout} label="Project Name" style={{marginRight: 6}}>
              <Input id="projectName" type="text" value={this.state.projectName} onChange={this.handleChange}/>
            </FormItem>
          </Col>
				</Row>
				<Row>
          <Col>
  					<FormItem {...formItemLayout} label="API URl" style={{marginRight: 6}}>
              <Input id="apiURL" type="text" value={this.state.apiURL} onChange={this.handleChange}/>
            </FormItem>
          </Col>
				</Row>
				<Row>
          <Col>
            <Button type="primary" htmlType="submit" onClick={this.handleSubmit} className={styles.button}>Submit</Button>
          </Col>
				</Row>
			</Form>
    );
  }
}
