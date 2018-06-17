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
        return (
            <Panel className="testcase_panel" {...this.props} header={testcase.name}>
                <div style={style}>
                    {JSON.stringify(testcase)}
                </div>
            </Panel>
        );
    }

}

const style = {
    padding: "4px 8px 4px 8px"

}



const Testcase = connect(mapStateToProps, mapDispatchToProps)(ConnectedTestcase);

export default Testcase;
