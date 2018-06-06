// @flow
import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import { Link } from 'react-router-dom';
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
	props: Props;

	render() {
		return (
			<div>
				<div className={styles.container} data-tid="container">
					<SplitPane split="vertical" defaultSize={300} minSize={200} maxSize={-500}>
						<div><p>Stuff</p></div>
						<div><p>More Stuff</p></div>
					</SplitPane>
				</div>
			</div>
		);
	}
}
