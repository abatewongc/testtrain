import React, { Component } from 'react';
import { connect } from "react-redux";
import { Spin, Button, Select, Option  } from 'antd';
import paths from 'path';
var fs = require('fs');


const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};


class ConnectedTestResultViewer extends React.Component {
	constructor() {
        super();

        this.state = {
            reportPath: '',
            reportIsLoaded: false,
            report: '',
        }

        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleButtonClick = () => {
        console.log(this.state.reportPath);
        require('electron').shell.openExternal(this.state.reportPath);
    }

    componentDidMount() {
        let { tefPath } = this.props.endpoint;
        // this is called every time the modal is opened, so we can find the latest report and load it now
        // the latest report is located in a subdirectory on the same level...
        console.log(tefPath)
        let reportPath = paths.join(tefPath, "../../../mochawesome-report/latest.html");
        console.log(reportPath);
        this.setState({ reportPath });
        fs.readFile(reportPath, 'utf-8', (err, data) => {
            if(!err) {
                this.setState({ reportIsLoaded: true });
            }
        });
    }


	render() {

                const { report } = this.state;
                const html = { __html: report };
                return(
                    <div style={{ textAlign: 'center' }}>
                    <Select
                        style={{ width: '60%' }}

                    >

                    </Select>
                    <Button
                    type="primary"
                    icon="plus"
                    size="upload"
                    onClick={this.handleButtonClick}
                    disabled={!this.state.reportIsLoaded}
                    >
                    </Button></div>
                );

    }
}

const TestResultViewer = ConnectedTestResultViewer;/*connect(mapStateToProps, mapDispatchToProps)(ConnectedTestResultViewer);*/

export default TestResultViewer;
