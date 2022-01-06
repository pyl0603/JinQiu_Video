import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import store from  '../redux/store';
import Cookies from "js-cookie";
import PageLayout from '../layouts/PageLayout';

import { Layout } from 'antd';
import '@styles/global.scss';

import Nav from '@component/Nav';
import Head from '@component/Header';
import {
	Switch,
	Redirect
} from "react-router-dom";

const { Content } = Layout;

const SecurityLayout = (props) => {
		const { route, location } = props
		// 声明一个叫 "collapsed" 的 state 变量
		const [collapsed, setCollapsed] = useState(false);

		const token = Cookies.get('token')
		const pathname = location.pathname;
    console.log('route', route)
		// console.log('username', encodeURI(pathname))
		
		if (!token && window.location.hash !== '#/user/login') {
      return <Redirect to={`/user/login?redirect=${pathname}`} />;
		}

    return (
			<div className="basic-layout" style={{ minHeight: '100vh' }}>
				<Layout>
					<Nav collapsed={collapsed} />
					<Layout>
						<Head getCollapsed = {() => setCollapsed(!collapsed)} />
						<Switch>
							<PageLayout route={route} />
						</Switch>
					</Layout>
				</Layout>
			</div>
		)
}

export default connect()(SecurityLayout);