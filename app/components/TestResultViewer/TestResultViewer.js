import React, { Component } from 'react';
import { connect } from "react-redux";
import { Spin } from 'antd';
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
    }

    componentDidMount() {
        let { tefPath } = this.props.endpoint;
        // this is called every time the modal is opened, so we can find the latest report and load it now
        // the latest report is located in a subdirectory on the same level...
        let reportPath = paths.join(tefPath, "../reports/latest.html");
        this.setState({ reportPath });
        fs.readFile(reportPath, 'utf-8', (err, data) => {
            if(!err) {
                this.setState({ report: data });
                this.setState({ reportIsLoaded: true });
            }
        });
    }
    

	render() {
        if(this.state.reportIsLoaded) {
                const { report } = this.state;
                const html = { __html: report };
                return(
                    <div>
                        <div dangerouslySetInnerHTML={html}></div>
                    </div>
                );
        } else {
            return(
                <div style={{ textAlign: 'center' }}><Spin /></div>
               
            );
        }
    }
}

const TestResultViewer = ConnectedTestResultViewer;/*connect(mapStateToProps, mapDispatchToProps)(ConnectedTestResultViewer);*/

export default TestResultViewer;
