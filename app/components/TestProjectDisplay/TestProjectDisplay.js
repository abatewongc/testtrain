import React, { Component } from 'react';
import {
	Menu,
	Icon,
	Select,
	Switch,
	Button,
	Form,
	Modal,
	Divider,
} from 'antd';
const FormItem = Form.Item;
const { Option, OptGroup } = Select;
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
var rimraf = require('rimraf');

const formItemLayout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 18 }
};

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

const ProjectMenuItem = (props) => <SubMenu {...props} data={props.data} key={props.data.path} title={<span><Icon type="folder" /><span>{props.data.name}</span></span>}>
	{
		//Need to find a way to map to test directory better
		props.data.children[0].children.map(ep => <Menu.Item style={{marginBottom: "0px"}}data={ep} key={ep.name}>{ep.name.replace(new RegExp('&', 'g'), '/')}</Menu.Item>)
	}
</SubMenu>


class ConnectedTestProjectDisplay extends React.Component {
	constructor() {
		super();
		this.state = {
			theme: 'light',
			current: '1',
			currentlySelectedProjectToDelete: '',
			menuItems: [],
			tempMenuItems: [],
			openKeys: [],
			menuRoot: '',
			projectDeleteModalVisible: false
		}

	this.getEndpointData = this.getEndpointData.bind(this);
	this.handleDeleteProjectButtonClick = this.handleDeleteProjectButtonClick.bind(this);
	this.handleDeleteProjectCancel = this.handleDeleteProjectCancel.bind(this);
	this.handleDeleteProject = this.handleDeleteProject.bind(this);
	this.handleDeleteProjectModalSelection = this.handleDeleteProjectModalSelection.bind(this);
	this.handleAddButtonClick = this.handleAddButtonClick.bind(this);

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
		let browserWindow = remote.getCurrentWindow()
		browserWindow.emit('add-new-project');
	}

	handleDeleteProjectButtonClick = (e) => {
		this.setState({currentlySelectedProjectToDelete: ''});
		this.setState({tempMenuItems: this.state.menuItems})
		this.setState({projectDeleteModalVisible: true});
	}

	handleDeleteProject = (e) => {
		let projectToDelete = this.state.currentlySelectedProjectToDelete;
		if(!projectToDelete || projectToDelete === '') {
			return;
		}

		try {
			rimraf.sync(projectToDelete);
		} catch(error) {
			// ignore this cuz im lazy and this isn't an enterprise app
		}

		this.setState({projectDeleteModalVisible: false});
	}

	handleDeleteProjectModalSelection = (value) => {
		this.setState({currentlySelectedProjectToDelete: value});
	}

	handleDeleteProjectCancel = (e) => {
		this.setState({projectDeleteModalVisible: false});
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
		let tempMenuData = this.state.tempMenuItems;
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
					style={{ width: 250, marginBottom: "0px" }}
					onOpenChange={this.onOpenChange}
					selectedKeys={[this.state.current]}
					openKeys={this.state.openKeys}
					mode="inline"
				>
				{
					menudata.map(data => <ProjectMenuItem key={data.path} data={data} /> )
				}
				</Menu>
				<Divider style={{margin: "4px", marginTop: "0px"}} />
				<Button
					type="default"
					shape="circle"
					icon="minus"
					size="default"
					onClick={this.handleDeleteProjectButtonClick}
					className={styles.addButton}
				></Button>
				<Button
					type="primary"
					shape="circle"
					icon="plus"
					size="default"
					onClick={this.handleAddButtonClick}
					className={styles.addButton}
				></Button>
				<Modal
					title="Delete Project"
					style={{ top: 20 }}
					visible={this.state.projectDeleteModalVisible}
					destroyOnClose={true}
					width='60%'
					onOk={this.handleDeleteProject}
					onCancel={this.handleDeleteProjectCancel}
				>
					<FormItem {...formItemLayout} label="Select Project">
						<Select id="deleteProjectModalSelect"
							style={{
								width: '60%'
							}}
							onChange={this.handleDeleteProjectModalSelection}
						>
								{
									tempMenuData.map((data) => <Option key={data.path} value={data.path}>{data.name}</Option>)
								}
						</Select>
					</FormItem>
				</Modal>
			</div>
		);
	}
}

const TestProjectDisplay = connect(mapStateToProps, mapDispatchToProps)(ConnectedTestProjectDisplay);

export default TestProjectDisplay;
