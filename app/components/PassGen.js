// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './PassGen.css';

type Props = {
  createPassword: () => void,
  passgen: string
};

export default class PassGen extends Component<Props> {
  props: Props;
  render(
  ) {
    const {
      createPassword,
      passgen
    } = this.props;
    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div data-tid="passgen">
          {passgen}
        </div>
        <button className={styles.btn} onClick={createPassword} data-tclass="btn"> Create Password </button>
      </div>
    );
  }
}
