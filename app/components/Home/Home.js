// @flow
import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import FileTree from '../FileTreeComponent';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import { Menu, Icon, Switch } from 'antd';
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
					<SplitPane split="vertical" defaultSize={250} minSize={250} maxSize={250}>
						<div><TestProjectDisplay dir={directory}/></div>
						<div><TestProjectViewer/></div>
					</SplitPane>
				</div>
			</div>
		);
	}
}
