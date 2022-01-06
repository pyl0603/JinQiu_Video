import React from 'react';
import {
	Switch
} from "react-router-dom";
import PageLayout from './PageLayout';

import { Layout } from 'antd';
import '@styles/global.scss';

import Nav from '@excomponent/Nav';
import Head from '@excomponent/Header';

class BasicLayout extends React.Component {
  state = {
    collapsed: false
  }

  collapsedValue = (val) => {
    this.setState({
      collapsed: !val
    })
  }

  render() {
    return (
			<div className="basic-layout" style={{ minHeight: '100vh' }}>
				<Layout>
					<Nav collapsed={this.state.collapsed} />
					<Layout>
						<Head getCollapsed = {this.collapsedValue} />
						<Switch>
							<PageLayout route={this.props.route} />
						</Switch>
					</Layout>
				</Layout>
			</div>
    );
  }
}

export default BasicLayout;
