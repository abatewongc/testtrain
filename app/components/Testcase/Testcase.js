import React, { Component } from 'react';
import { connect } from "react-redux";
import { Icon,
            Collapse,
            Layout,
            List,
            Select,
            Divider,
            Button,
            Tooltip,
            Tag,
            Table,
            InputNumber
 } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const Panel = Collapse.Panel;
const Option = Select.Option;

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


          this.handleChange = this.handleChange.bind(this);
          this.handleBlur = this.handleBlur.bind(this);
          this.handleFocus = this.handleFocus.bind(this);
          this.renderInputs = this.renderInputs.bind(this);
          this.renderOutputs = this.renderOutputs.bind(this);

      }

      handleChange(value) {
        console.log(`selected ${value}`);
      }

      handleBlur() {
        console.log('blur');
      }

      handleFocus() {
        console.log('focus');
      }

      renderInputs(testcase) {
        return(
            <Table dataSource={testcase.inputs} columns={columns} pagination={false} />
        );
      }

      renderOutputs(testcase) {
        return(
            <Table dataSource={testcase.outputs} columns={columns} pagination={false} />
        );
      }

    render() {
        const { testcase } = this.props;
        return (
            <Panel className="testcase_panel" {...this.props} header={testcase.name}>
                <div style={style}>
                    <Layout style={{ backgroundColor: '#FFFFFF', padding: "0px 0px 0px 0px"}} hasSider="true">
                        <Content style={{ backgroundColor: '#FFFFFF', padding: "0px 0px 0px 0px"}}>
                        <Divider style={dividerStyle} orientation="left" >Request Type | Success | Failure</Divider>
                          <Select
                            showSearch
                            style={{ width: 120 }}
                            placeholder="Select a request type"
                            optionFilterProp="children"
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            defaultValue="POST"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          >
                            <Option value="POST">POST</Option>
                            <Option value="GET">GET</Option>
                            <Option value="PUT">PUT</Option>
                            <Option value="PATCH">PATCH</Option>
                            <Option value="DELETE">DELETE</Option>
                          </Select>
                          <Divider type='vertical'></Divider>
                          <InputNumber min={1} max={1000} disabled={this.state.disabled} defaultValue={testcase.success} />
                          <Divider type='vertical' ></Divider>
                          <InputNumber min={1} max={1000} disabled={this.state.disabled} defaultValue={testcase.fail} />
                          <Divider type='vertical'></Divider>
                          <Tooltip style={toolTipStyle} title="Total Successes">
                            <Tag color="green">{testcase.num_successes}</Tag>
                          </Tooltip>
                          <Tooltip style={toolTipStyle} title="Total Runs">
                            <Tag color="purple">{testcase.num_runs}</Tag>
                          </Tooltip>
                          <Divider style={dividerStyle} orientation="left" ></Divider>
                          <Collapse bordered={false}>
                            <Panel header="Inputs">
                                {this.renderInputs(testcase)}
                            </Panel>
                            <Panel header="Outputs">
                                {this.renderOutputs(testcase)}
                            </Panel>
                          </Collapse>
                          <div style={{marginBottom: "8px"}} />
                        </Content>
                        <Sider theme="light" width="36px" style={{ borderLeft: '1px solid #F1F2F6'  }}>
                        <div style={buttonContainerStyle}>
                            <Button style={buttonStyle} type="default" shape="circle" icon="edit" size="small" />
                            <Button style={buttonStyle} type="default" shape="circle" icon="delete" size="small" />
                            <Button style={buttonStyle} type="default" shape="circle" icon="sync" size="small" />
                        </div>
                        </Sider>
                    </Layout>
                </div>
            </Panel>
        );
    }

}

const columns = [{
    title: 'Parameter',
    dataIndex: 'parameter',
    key: 'parameter',
  }, {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  }, {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
  }];

const toolTipStyle = {
    position: "absolute",
    float: "right",
}

const buttonContainerStyle = {
    textAlign: "right",
}

const dividerStyle = {
    margin: "8px 8px 8px 4px",
    padding: "0px 0px 0px 0px",
}

const buttonStyle = {
    margin: "2px 2px 2px 2px",
    padding: "0px 0px 0px 0px",
}

const style = {
    padding: "4px 8px 4px 8px",
    background: "#FFFFFF",
}



const Testcase = connect(mapStateToProps, mapDispatchToProps)(ConnectedTestcase);

export default Testcase;
