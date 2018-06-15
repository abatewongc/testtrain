// eslint-disable class-methods-use-this
import React, { Component } from 'react';
const {dialog} = require('electron').remote;
const Store = require('electron-store');
import styles from './AddEndpointModalWindow.css'
const path = require('path');
const dirTree = require('directory-tree');
const remote = require('electron').remote;

export default class CreateProjectModalWindow extends Component {
  constructor() {
    super();
    this.state = {
			endpoint: '',
      project: 'Please Select a Project',
      testItems: [{ parameter: '', type: '', testValue: ''}],
      successCode: '',
      failCode: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTestParameter = this.handleTestParameter.bind(this);
    this.handleTestType = this.handleTestType.bind(this);
    this.handleTestTestValue = this.handleTestTestValue.bind(this);
    this.handleAddTestItem = this.handleAddTestItem.bind(this);
    this.handleRemoveTestItem = this.handleRemoveTestItem.bind(this);
    this.createSelectItems = this.createSelectItems.bind(this);
    this.onDropdownSelected = this.onDropdownSelected.bind(this);
    this.test = this.test.bind(this);
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

  handleTestType = (idx) => (event) => {
    const newTestItems = this.state.testItems.map((testItem, sidx) => {
      if(idx !== sidx) {
        return testItem;
      } else {
        return {...testItem, type: event.target.value};
      }
    });

    this.setState({testItems: newTestItems});
  }

  handleTestTestValue = (idx) => (event) => {
    const newTestItems = this.state.testItems.map((testItem, sidx) => {
      if(idx !== sidx) {
        return testItem;
      } else {
        return {...testItem, testValue: event.target.value};
      }
    });

    this.setState({testItems: newTestItems});
  }

  handleAddTestItem = () => {
    this.setState({
      testItems: this.state.testItems.concat([{ parameter: '', type: '', testValue: ''}])
    });
  }

  handleRemoveTestItem = (idx) => () => {
    this.setState({
      testItems: this.state.testItems.filter((s, sidx) => idx !== sidx)
    });
  }

  createSelectItems() {
    let items = [];
    let projects = dirTree(new Store().get('testcase_datastorage_local'), {extensions:/\.tpf$/}).children;
    items.push(<option key="0" value="Please Select a Project">Please Select a Project</option>);
    for(let i = 0; i < projects.length; i++) {
      let projectName = projects[i].name;
      let index = i + 1;
      items.push(<option key={index} value={projectName}>{projectName}</option>);
    }
    return items;
  }

  onDropdownSelected(event) {
    this.setState({project: event.target.value});
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
      let projects = dirTree(new Store().get('testcase_datastorage_local'), {extensions:/\.tpf$/}).children;
      projects.forEach(function(project) {
        console.log(project);
        if(project.name == projectName) {
          let store = new Store({
            cwd: path.join(project.path, "\\", endpoint),
            fileExtension: "tef"
          });

          store.set('testItems', testItems);
          store.set('successCode', successCode);
          store.set('failCode', failCode);

          let window = remote.getCurrentWindow();
          window.close();
        }
      })
    }
  }

  test() {
    let projects = dirTree(new Store().get('testcase_datastorage_local'), {extensions:/\.tpf$/}).children;
    console.log(projects);
  }

  render() {
    return (
			<form onSubmit={this.handleSubmit}>
        <div className={styles.container}>
          <label className={styles.label}>Endpoint: </label>
          <input id="endpoint" type="text" value={this.state.endpoint} onChange={this.handleChange} size="8"/>
          <button type="button" onClick={this.handleAddTestItem} className="small" className={styles.button}>Add Parameter</button>
        </div>
        <div className={styles.container}>
          <label className={styles.label}>Project: </label>
          <select value={this.state.project} onChange={this.onDropdownSelected}>
            {this.createSelectItems()}
          </select>
        </div>
        {this.state.testItems.map((testItem, idx) => (
          <div className={styles.container}>
            <div className={styles.col_fourth}>
              <label className={styles.label}>Parameter:</label>
              <input type="text" value={testItem.parameter} onChange={this.handleTestParameter(idx)}  size="8" />
            </div>
            <div className={styles.col_fourth}>
              <label className={styles.label}>Type</label>
              <input type="text" value={testItem.type} onChange={this.handleTestType(idx)}  size="8" />
            </div>
            <div className={styles.col_fourth}>
              <label className={styles.label}>Test Value</label>
              <input type="text" value={testItem.testValue} onChange={this.handleTestTestValue(idx)} size="8" />
            </div>
            <div className={styles.col_fourth}>
              <button type="button" onClick={this.handleRemoveTestItem(idx)} className={styles.button}>-</button>
            </div>
          </div>
        ))}
        <div className={styles.container}>
          <label className={styles.label}>Successful Response Code:</label>
          <input id="successCode" type="text" value={this.state.successCode} onChange={this.handleChange} size="8" />
        </div>
        <div className={styles.container}>
          <label className={styles.label}>Failure Response Code:</label>
          <input id="failCode" type="text" value={this.state.failCode} onChange={this.handleChange} size="8" />
        </div>
        <div className={styles.container}>
          <input type="submit" onClick={this.handleSubmit} className={styles.button} />
        </div>
        <div className={styles.container}>
          <button type="button" onClick={this.test} className={styles.button}>Test</button>
        </div>
			</form>
    );
  }
}
