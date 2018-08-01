// @flow
import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import { Menu, Icon, Switch, Layout, Divider } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;

import TestProjectDisplay from '../TestProjectDisplay/TestProjectDisplay'
import TestProjectViewer from '../TestProjectViewer/TestProjectViewer'

type Props = {};
const ElectronStore = require('electron-store');
const localstore = new ElectronStore();
const directory = localstore.get('testcase_datastorage_local');

export default class Home extends Component<Props> {
	props: Props;

	render() {
		return (
			<div>
				<div className={styles.container} data-tid="container">
					<Layout>
						<Sider width={250} theme="light">
						<div><TestProjectDisplay dir={directory}/></div>
						</Sider>
						<Content>
						<div><TestProjectViewer/></div>
						</Content>
					</Layout>
				</div>
			</div>
		);
	}
}
