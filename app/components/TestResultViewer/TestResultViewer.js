import React, { Component } from 'react';
import { connect } from "react-redux";
import { Spin, Button, Select } from 'antd';
import paths from 'path';
var fs = require('fs');
const Option = Select.Option;


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
            currentlySelectedReport: '',
            reportIsLoaded: false,
            reports: [],
        }

        this.handleSelectionChange = this.handleSelectionChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleButtonClick = () => {
        require('electron').shell.openExternal(this.state.currentlySelectedReport);
    }
    handleSelectionChange = (value) => {
        this.setState({currentlySelectedReport: value})
    }

    componentDidMount() {
        this.setState({ currentlySelectedReport: '' })
        let { tefPath, name } = this.props.endpoint;
        // this is called every time the modal is opened, so we can find the latest report and load it now
        // the latest report is located in a subdirectory on the same level...
        let reportPath = paths.join(tefPath, "../../../mochawesome-report/", name );
        this.setState({ reportPath });
        let tempreports = fs.readdirSync(reportPath);
        let reports = [];
        tempreports = tempreports.filter(el => /\.html$/.test(el))
        tempreports.forEach(element => {
            reports.push({
                name: element,
                fullpath: paths.join(reportPath, element),
            })
        });
        if(reports.length > 0) {
            this.setState({ reportIsLoaded: true })
        }
        this.setState({ reports })



    }


	render() {

                const { reports } = this.state;
                return(
                    <div style={{ textAlign: 'center' }}>
                    <Select
                        style={{ width: '60%' }}
                        onChange={this.handleSelectionChange}
                    >
                        {
                            reports.map((report) => <Option key={report.name} value={report.fullpath}>{report.name}</Option>)
                        }
                    </Select>
                    <Button
                    type="primary"
                    icon="upload"
                    size="default"
                    onClick={this.handleButtonClick}
                    disabled={!this.state.reportIsLoaded}
                    >
                    </Button></div>
                );

    }
}

const TestResultViewer = ConnectedTestResultViewer;/*connect(mapStateToProps, mapDispatchToProps)(ConnectedTestResultViewer);*/

export default TestResultViewer;
