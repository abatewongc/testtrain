// @flow
import React, { Component } from 'react';
import AddEndpointModalWindow from '../components/AddEndpointModalWindow';

type Props = {};

export default class HomePage extends Component<Props> {
  props: Props;

  render() {
    return <AddEndpointModalWindow />;
  }
}
