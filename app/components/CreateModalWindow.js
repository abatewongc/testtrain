// @flow
import React, { Component } from 'react';
import FileTree from 'react-filetree-electron';
import { Link } from 'react-router-dom';
import styles from './Home.css';

export default class Home extends Component<Props> {
	props: Props;

	render() {
		return (
			<div>
				<div className={styles.container} data-tid="container">
          <p>Hello Spiffy</p>
				</div>
			</div>
		);
	}
}
