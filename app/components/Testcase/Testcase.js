import React, { Component } from 'react';
import { connect } from "react-redux";
import { Collapse } from 'antd';
const Panel = Collapse.Panel;

const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

class ConnectedTestcase extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };

      }

    render() {
        const { testcase } = this.props;
        console.log(testcase);
        return (
            <Panel {...this.props} header={testcase.name}>
                <p>{JSON.stringify(testcase)}</p>
            </Panel>
        );
    }

}


const Testcase = connect(mapStateToProps, mapDispatchToProps)(ConnectedTestcase);

export default Testcase;
