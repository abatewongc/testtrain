import React, { Component } from 'react';
import {
	Menu,
	Icon,
	Switch,
	Button,
} from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
const Store = require('electron-store');
const dirTree = require('directory-tree');
const path = require('path');
const fs = require('fs');
const SubMenu = Menu.SubMenu;
import { connect } from "react-redux";
import { loadEndpoint } from "../../actions/endpoint-viewer";
import styles from './TestProjectDisplay.css';
const remote = require('electron').remote;

const mapStateToProps = state => {
	return {
		endpoint: state.current_endpoint_reducer.current_endpoint.endpoint
	};
};

const mapDispatchToProps = dispatch => {
	return {
		loadEndpoint: endpoint => dispatch(loadEndpoint(endpoint)),
	};
};

class ConnectedTestProjectDisplay extends React.Component {
	constructor() {
		super();
		this.state = {
			theme: 'light',
			current: '1',
			menuItems: [],
			openKeys: [],
			menuRoot: ''
		}

	this.getEndpointData = this.getEndpointData.bind(this);
	}

	componentDidMount() {
		if(this.state.refreshid) {
			clearInterval(refreshid);
		}
		let _refreshid = setInterval(() => {
			try {
				let menuItems = dirTree(this.props.dir, {extensions:/\.txt/, exclude: [/node_modules/, /mochawesome-report/]}).children;
				this.setState({menuItems});
			} catch(err) {
				console.log(err);
			}
		}, 500);
		this.setState({
			refreshid: _refreshid,
		})
	}


	changeTheme = (value) => {
		this.setState({
			theme: value ? 'dark' : 'light',
		});
	}

  getEndpointData = (key) => {
    for(let i = 0; i < this.state.menuItems.length; i++) {
      let project = this.state.menuItems[i].children[0];
      for(let j = 0; j < project.children.length; j++) {
        let child = project.children[j];
        if(child.name == key) {
          let projectName = this.state.menuItems[i].name;
          let tefPath = path.join(project.path, key, key + '.tef');
          let data = JSON.parse(fs.readFileSync(tefPath, 'utf8'));
          return {
            projectName: projectName,
            data: data,
            tefPath: tefPath
          }
        }
      }
    }
  }

	handleAddButtonClick = (e) => {
		console.log(e);
		console.log("add button clicked");
		let browserWindow = remote.getCurrentWindow()
		browserWindow.emit('add-new-project');
	}

	handleMenuClick = (e) => {
		this.setState({
			current: e.key,
		});
		if(!e.keyPath[0].endsWith(".tpf")) {
      let endpointData = this.getEndpointData(e.key);
      const endpoint = {
          name: e.key,
          projectName: endpointData.projectName,
          data: endpointData.data,
          tefPath: endpointData.tefPath,
          disabled: false
      }
      this.props.loadEndpoint({endpoint});
      this.forceUpdate();
		}
	}

	onOpenChange = (openKeys) => {
		let rootSubmenuKeys = []
		this.state.menuItems.forEach(element => {
			rootSubmenuKeys.push(element.path);
		})

		const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
		if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
			this.setState({ openKeys });
		} else {
			this.setState({
				openKeys: latestOpenKey ? [latestOpenKey] : [],
			});
		}
	}

	render() {
		let menudata = this.state.menuItems;
		return (
			<div>
				<Switch
					id="hidden"
					checked={this.state.theme === 'dark'}
					onChange={this.changeTheme}

					checkedChildren="Dark"
					unCheckedChildren="Light"
				/>
				<Menu
					theme={this.state.theme}
					onClick={this.handleMenuClick}
					style={{ width: 250 }}
					onOpenChange={this.onOpenChange}
					selectedKeys={[this.state.current]}
					openKeys={this.state.openKeys}
					mode="inline"
				>
				{
					menudata.map(data => <ProjectMenuItem key={data.path} data={data} /> )
				}
				</Menu>
				<Button
					type="primary"
					shape="circle"
					icon="plus"
					size="default"
					onClick={this.handleAddButtonClick}
					className={styles.addButton}
				></Button>
			</div>
		);
	}
}

const ProjectMenuItem = (props) =>
	<SubMenu {...props} data={props.data} key={props.data.path} title={<span><Icon type="folder" /><span>{props.data.name}</span></span>}>
	{
		//Need to find a way to map to test directory better
		props.data.children[0].children.map(ep => <Menu.Item data={ep} key={ep.name}>{ep.name.replace(new RegExp('&', 'g'), '/')}</Menu.Item>)
	}
	</SubMenu>



const TestProjectDisplay = connect(mapStateToProps, mapDispatchToProps)(ConnectedTestProjectDisplay);

export default TestProjectDisplay;
