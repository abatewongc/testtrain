// @flow
import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import FileTree from '../components/FileTreeComponent';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import { Menu, Icon, Switch } from 'antd';
const SubMenu = Menu.SubMenu;

import TestProjectDisplay from './TestProjectDisplay/TestProjectDisplay'
import TestProjectViewer from './TestProjectViewer/TestProjectViewer'

type Props = {};
const Store = require('electron-store');
const store = new Store();
const directory = store.get('testcase_datastorage_local');
console.log(directory)

export default class Home extends Component<Props> {
	props: Props;

	render() {
		return (
			<div>
				<div className={styles.container} data-tid="container">
					<SplitPane split="vertical" defaultSize={250} minSize={250} maxSize={250}>
						<div><TestProjectDisplay dir={directory}/></div>
						<div></div>
					</SplitPane>
				</div>
			</div>
		);
	}
}
