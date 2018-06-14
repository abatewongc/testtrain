import React, { Component } from 'react';
import { Menu, Icon, Switch } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
const dirTree = require('directory-tree');
const SubMenu = Menu.SubMenu;

export default class TestProjectDisplay extends React.Component {
	constructor() {
		super();
		this.state = {
			theme: 'dark',
			current: '1',
			menuItems: [],
			openKeys: [],
			menuRoot: 'hello'
		}
	}

	componentDidMount() {
		setInterval(() => {
			let menuItems = dirTree(this.props.dir, {extensions:/\.tpf$/}).children;
			this.setState({menuItems});
		}, 500);
	}


	changeTheme = (value) => {
		this.setState({
			theme: value ? 'dark' : 'light',
		});
	}

	handleClick = (e) => {
		console.log('click beep', e);
		this.setState({
			current: e.key,
		});
		if(!e.keyPath[0].endsWith(".tpf")) {

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
					onClick={this.handleClick}
					style={{ width: 256 }}
					onOpenChange={this.onOpenChange}
					selectedKeys={[this.state.current]}
					openKeys={this.state.openKeys}
					mode="inline"
				>
				{
					menudata.map(data => <ProjectMenuItem key={data.path} data={data} /> )
				}
				</Menu>
			</div>
		);
	}
}

const ProjectMenuItem = (props) =>
	<SubMenu {...props} data={props.data} key={props.data.path} title={<span><Icon type="folder" /><span>{props.data.name}</span></span>}>
	{
		props.data.children.map(ep => <Menu.Item data={ep} key={ep.name}>{ep.name}</Menu.Item>)
	}
	</SubMenu>