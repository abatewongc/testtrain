// @flow
import React, { Component } from 'react';
import CreateProjectModalWindow from '../components/CreateProjectModalWindow';

type Props = {};

export default class HomePage extends Component<Props> {
  props: Props;

  render() {
    return <CreateProjectModalWindow />;
  }
}
