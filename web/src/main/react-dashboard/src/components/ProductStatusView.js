/*
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { Component } from 'react';
import '../App.css';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import SingleRecord from './SingleRecord.js';
import { add_current_product } from '../actions/testGridActions.js';
import Moment from 'moment'
import ReactTooltip from 'react-tooltip'

class ProductStatusView extends Component {

  constructor(props) {
    super(props);
    this.baseURL = "/testgrid/dashboard"
    this.state = {
      hits: []
    };
  }

  componentDidMount() {
    var url = this.baseURL + '/api/products/product-status'
    fetch(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {

      return response.json();
    })
      .then(data => this.setState({ hits: data }));
  }

  nevigateToRoute(route, product) {
    this.props.dispatch(add_current_product(product));
    this.props.history.push(route);
  }

  render() {
    const products = this.state.hits.map((product, index) => {
      return (<TableRow key={index}>

        <TableRowColumn> <SingleRecord value={product.status} /> </TableRowColumn>
        <TableRowColumn ><h2 style={{ cursor: 'pointer' }} onClick={() => this.nevigateToRoute( this.baseURL + "/deployments/product/" + product.id, {
          productId: product.id,
          productName: product.name,
        })}><i>{product.name}</i></h2></TableRowColumn>
        <TableRowColumn>
          {(() => {
            if (product.lastBuild.modifiedTimestamp) {
              return (
                <SingleRecord value={product.lastBuild.status}
                  nevigate={() => this.nevigateToRoute(this.baseURL + "/deployments/product/" + product.id, {
                    productId: product.id,
                    productName: product.name,
                  })} time={product.lastBuild.modifiedTimestamp}
                />)
            } else {
              return (<h4> No builds yet!</h4>);
            }
          })()}
        </TableRowColumn>
        <TableRowColumn>
          {(() => {
            if (product.lastfailed.modifiedTimestamp) {
              return (
                <h4 onClick={() => this.nevigateToRoute(this.baseURL + "/deployments/product/" + product.id, {
                  productId: product.id,
                  productName: product.name,
                })} style={{ cursor: 'pointer', textDecoration: 'underline' }} >{Moment(product.lastBuild.modifiedTimestamp).fromNow()}</h4>
              );
            } else {
              return (<h4> No failed builds yet!</h4>)
            }
          })()}
        </TableRowColumn>
        <TableRowColumn> <img src={require('../play.png')} width="36" height="36" data-tip="Execute job" onClick={() => { window.location = '/job/wso2is5.4.0LTS/build' }} /> <ReactTooltip /></TableRowColumn>
        <TableRowColumn ><img src={require('../configure.png')} width="36" height="36" style={{ cursor: 'pointer' }}
          onClick={() => { window.location = '/job/wso2is5.4.0LTS/configure' }} data-tip="Configure job" />
        </TableRowColumn>
      </TableRow>)
    });

    return (
      <Table >
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn><h1>Status</h1> </TableHeaderColumn>
            <TableHeaderColumn><h1>Job</h1> </TableHeaderColumn>
            <TableHeaderColumn><h1>Latest Build</h1> </TableHeaderColumn>
            <TableHeaderColumn><h1>Last Failure</h1> </TableHeaderColumn>
            <TableHeaderColumn><h1>Execute</h1> </TableHeaderColumn>
            <TableHeaderColumn><h1>Configure</h1> </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {products}
        </TableBody>
      </Table>
    )
  }
}

export default ProductStatusView;