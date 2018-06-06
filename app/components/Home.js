// @flow
import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import FileTree from 'react-filetree-electron';
import { Link } from 'react-router-dom';
import styles from './Home.css';

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
					<SplitPane split="vertical" defaultSize={200} minSize={50} maxSize={-500}>
						<div><FileTree directory={directory} /></div>
						<div><p>More Stuff</p></div>
					</SplitPane>
				</div>
			</div>
		);
	}
}
