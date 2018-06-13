// eslint-disable class-methods-use-this
import React, { Component } from 'react';
const {dialog} = require('electron').remote;
const Store = require('electron-store');
import styles from './CreateProjectModalWindow.css'

export default class CreateProjectModalWindow extends Component {
  constructor() {
    super();
    this.state = {
      projectName: '',
			projectDirectory: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
		this.handleDirectory = this.handleDirectory.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

	handleDirectory(event) {
		document.getElementById('directoryInput').value = dialog.showOpenDialog({
			title: 'Select Project Directory',
			properties: ['openDirectory']
		})[0];
	}

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.projectName);
    event.preventDefault();
  }

  render() {
    return (
			<form onSubmit={this.handleSubmit}>
				<div className={styles.container}>
					<label className={styles.label}>
						Project Name:
					</label>
          <input type="text" value={this.state.projectName} onChange={this.handleChange} />
				</div>
				<div className={styles.container}>
					<label className={styles.label}>
						Directory:
					</label>
          <input type="text" value={this.state.projectDirectory} onChange={this.handleChange} id="directoryInput"  className={styles.label}/>
          <button type="button" onClick={this.handleDirectory}> Choose a Directory </button>
				</div>
				<div className={styles.submitDiv}>
					<input type="submit" value="Submit" />
				</div>
			</form>
    );
  }
}
