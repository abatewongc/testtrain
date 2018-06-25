import React, { Component } from 'react';
import { Divider, Button } from 'antd';
import { connect } from "react-redux";
import { loadEndpoint, clearEndpoint, editEndpoint } from "../../actions/endpoint-viewer";
import MenuBuilder from '../../menu.js';
import styles from './EndpointViewer.css'

const mapStateToProps = state => {
    return {
      endpoint: state.current_endpoint_reducer.current_endpoint.endpoint,
      edit: state.current_endpoint_reducer.edit_endpoint
    };
};

const mapDispatchToProps = dispatch => {
    return {
      loadEndpoint: endpoint => dispatch(loadEndpoint(endpoint)),
      clearEndpoint: endpoint => dispatch(clearEndpoint(endpoint)),
      editEndpoint: edit => dispatch(editEndpoint(edit))
    };
};

class ConnectedEndpointViewer extends React.Component {
    constructor() {
        super();

        this.state = {
          endpoint: "",
        };

        this.generateClicked = this.generateClicked.bind(this);
        this.editClicked = this.editClicked.bind(this);
        this.deleteClicked = this.deleteClicked.bind(this);
        this.uploadClicked = this.uploadClicked.bind(this);
      }

    generateClicked = (e) => {
        console.log(e);

    }
    editClicked = (e) => {
        if(this.props.edit) {
          this.props.editEndpoint(false);
        } else {
          this.props.editEndpoint(true);
        }
    }
    deleteClicked = (e) => {
        console.log(e);
        e.preventDefault();
        const endpoint = emptyEndpoint;
        this.props.clearEndpoint({endpoint});
    }
    uploadClicked = (e) => {
        console.log(e);
    }


    render() {
        const {endpoint} = this.props;
        const disabled = (endpoint === undefined || endpoint.disabled); // dunno how to set default props lul
        if(disabled) {
          return (
            <div>
            <div>You have nothing selected.</div>
            </div>
          )
        } else {
        return (
            <div style={{paddingLeft: 12, paddingTop: '4px', paddingBottom: '0px', textAlign: 'left', overflow: 'auto', height: '100%', lineHeight: 1.1}}>
                <p className="margin-0" id="endpoint_display_title">{endpoint.name.replace(new RegExp('&', 'g'), '/')}</p>
                <div className={styles.buttonMenu} id="endpoint_display_path" >
                  <Divider type="vertical" />
                    <Button type="primary" size="small" onClick={this.generateClicked}>Generate</Button>
                    <Divider type="vertical" />
                    <Button size="small" onClick={this.editClicked}>Edit</Button>
                    <Divider type="vertical" />
                    <Button size="small" onClick={this.deleteClicked}>Delete</Button>
                    <Divider type="vertical" />
                    <Button size="small" onClick={this.uploadClicked}>Upload</Button>
                </div>
            </div>
        );
    }
    }
  }

  const emptyEndpoint = {
    name: 'null, get a new endpoint',
    path:'DISABLEDDISABLEDDISABLEDDISABLEDDISABLED',
    end: 'end'
  }

const EndpointViewer = connect(mapStateToProps, mapDispatchToProps)(ConnectedEndpointViewer);

export default EndpointViewer;
