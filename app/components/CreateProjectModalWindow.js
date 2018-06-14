// eslint-disable class-methods-use-this
import React, { Component } from 'react';
const {dialog} = require('electron').remote;
const Store = require('electron-store');
import styles from './CreateProjectModalWindow.css'
const path = require('path');
const remote = require('electron').remote;

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
    return (
			<form onSubmit={this.handleSubmit}>
				<div className={styles.container}>
					<label className={styles.label}>Project Name:</label>
          <input id="projectName" type="text" value={this.state.projectName} onChange={this.handleChange} />
				</div>
				<div className={styles.container}>
					<label className={styles.label}>API URL:</label>
					<input id="apiURL" type="text" value={this.state.apiURL} onChange={this.handleChange} />
				</div>
				<div className={styles.submitDiv}>
					<input type="submit" value="Submit" />
				</div>
			</form>
    );
  }
}
