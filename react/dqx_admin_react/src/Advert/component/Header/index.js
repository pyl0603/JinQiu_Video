import React from 'react';
import { Layout, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import Cookies from "js-cookie";
import { withRouter } from 'react-router-dom';

import { loginout } from '@api/user';

import './style.scss';

const { Header } = Layout;

class Head extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			collapsed: false,
			isLogin: true
		}
		this.username = localStorage.getItem('username')
	}

	/**
	 * 控制导航栏开关
	 */
	toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
		});
		
		this.props.getCollapsed(this.state.collapsed)
	};

	/**
	 * 
	 */
	async loginout() {
		const res = await loginout();
		localStorage.removeItem('username');
		localStorage.removeItem('type');
		Cookies.remove('token');
		// Cookies.remove('Category');
		this.setState({
			isLogin: false
		})
		this.props.history.push('/user/login');
	}

	render () {
		return (
			<Header className="site-layout-background">
				<span className="header-trigger" onClick={this.toggleCollapsed}>
					{React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
				</span>
				{/* <div className="header-loginout">
					<Avatar icon={<UserOutlined />} />{this.username}
				</div> */}
				{
					this.state.isLogin ?
					<div style={{ float: 'right' }}>
						<span>{this.username}</span>
						<span style={{ marginLeft: '6px', cursor: 'pointer'}} onClick={this.loginout.bind(this)}>退出</span>
					</div>
					:
					null
				}
			</Header>
		)
	}
}

Head = withRouter(Head)

export default Head;
