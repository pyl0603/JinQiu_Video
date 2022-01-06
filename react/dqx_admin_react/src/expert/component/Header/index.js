import React from 'react';
import { connect } from "react-redux";
import { Layout, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import Cookies from "js-cookie";
import { withRouter } from 'react-router-dom';

import { loginout, userInfo } from '../../api/user';
import store from  '../../redux/store';
import { setUserName } from '../../redux/actions';

import './style.scss';

const { Header } = Layout;

class Head extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			collapsed: false,
			isLogin: true,
			username: '',
			avatar: ''
		}
	//	this.username = localStorage.getItem('username')
	store.subscribe(() => {
			this.setState({
				username: store.getState().userNameValue
			})
		})
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
	 * 登出
	 */
	async loginout() {
		const res = await loginout();
		localStorage.removeItem('username');
		localStorage.removeItem('type');
		Cookies.remove('token');
		Cookies.remove('Category');
		this.setState({
			isLogin: false
		})
		this.props.history.push('/login');
	}

	async userInfo() {
		const res = await userInfo();
		this.props.dispatch(setUserName(res.data.nickname));
		this.setState({
			username: store.getState().userNameValue,
			avatar: res.data.avatar
		})
	}

	componentDidMount() {
		if (Cookies.get('token')) {
			this.userInfo()
		}else{
			this.props.history.push('/Login')
		}
	}
	 //如果有异步设置state值的情况，在组件销毁时清除所有的state状态
	 componentWillUnmount() {
    this.setState = (state, callback) => {
        return
    }
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
					<div className="user-info" style={{ float: 'right' }}>
						<div className="avatar"><img src={this.state.avatar} /></div>
						<span>{this.state.username}</span>
						<span style={{ marginLeft: '6px', cursor: 'pointer'}} onClick={this.loginout.bind(this)}>退出</span>
					</div>
					:
					null
				}
			</Header>
		)
	}
}
Head = connect()(Head)
Head = withRouter(Head)

export default Head;
