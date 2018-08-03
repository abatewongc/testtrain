// eslint-disable class-methods-use-this
import React, { Component } from 'react';
import { Form, Row, Input, Button, Col, Spin } from 'antd';
import styles from './CreateProjectModalWindow.css'
const {dialog} = require('electron').remote;
const Store = require('electron-store');
const path = require('path');
const remote = require('electron').remote;
const FormItem = Form.Item;
const fs = require('fs');
const spawn = require('child_process').spawn;

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

    //Create store containing project information
		let homeDir = new Store().get('testcase_datastorage_local');
    let newDir = path.join(homeDir, this.state.projectName);
		let store = new Store({
			name: this.state.projectName,
			cwd: newDir,
			fileExtension: "tpf"
		})
		store.set('apiURL', this.state.apiURL);

    //Create package.json
    let packagePath = path.join(newDir, 'package.json');
    let packageJson = {
      "name": this.state.projectName,
      "version": "1.0.0",
      "description": "For testing API",
      "author": "",
      "license": "ISC",
      "dependencies": {
        "chai": "^4.1.2",
        "chai-http": "^4.0.0",
        "mocha": "^5.2.0",
        "mochawesome": "^3.0.2",
        "mochawesome-report-generator": "^3.1.2"
      }
    }
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 4));

    //Create test directory
    let testPath = path.join(newDir, 'test');
    if(!fs.existsSync(testPath)) {
      fs.mkdirSync(testPath);
    }

    let reportPath = path.join(newDir, 'mochawesome-report');
    if(!fs.existsSync(reportPath)) {
      fs.mkdirSync(reportPath);
}

    //Span NPM install child process into directory
    let args = ['install'];
    console.log(newDir);
    let options = {
      cwd: newDir
    }
    const child = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['install'], options);

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

    //Close modal window when node modules are installed
    child.on('close', function(code) {
  		let window = remote.getCurrentWindow();
  		window.close();
    });
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    };

    return (
      <div id="modalRoot">
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
      </div>
    );
  }
}
