import React, { Component } from 'react';
import { Divider, Button } from 'antd';





export default class EndpointViewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          endpoint: props.endpoint,
        };
      }

    generateClicked = (e) => {
        console.log(e);

    }
    editClicked = (e) => {
        console.log(e);

    }
    deleteClicked = (e) => {
        console.log(e);
        this.setState({
            endpoint: emptyEndpoint
        })
    }


    render() {
        const endpoint = this.state.endpoint;
        return (
            <div style={{paddingLeft: 12, paddingTop: '8px', paddingBottom: 0, textAlign: 'left', overflow: 'auto', height: '100%', lineHeight: 1.1}}>
                <p className="margin-0" id="endpoint_display_title">{endpoint.path}</p>
                <p className="margin-0"id="endpoint_display_path" >
                    <Divider type="vertical" />
                    <Button type="primary" size="small" onClick={this.generateClicked}>Generate</Button>
                    <Divider type="vertical" />
                    <Button size="small" onClick={this.editClicked}>Edit</Button>
                    <Divider type="vertical" />
                    <Button size="small" onClick={this.deleteClicked}>Delete</Button>
                </p>
            </div>
        );
    }
  }

  const emptyEndpoint = {
    name: 'null, get a new endpoint',
    path:'/null/select/or/create/a/new/endpoint',
    end: 'end'
  }

