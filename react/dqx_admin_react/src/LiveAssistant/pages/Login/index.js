import React from 'react';
import { connect } from "react-redux";
import { setToken } from "../../redux/actions";
import Cookies from "js-cookie";

import { Tabs } from 'antd';
import logo from '../../img/logo.png';

import {
	LoginAccoutForm,
	LoginCodeForm
} from '../../../component/Login';

import { login, loginSMS, sms } from '@liveapi/user';

import './style.scss';

const { TabPane } = Tabs;

class Login extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			tabKey: '1'
		}
	}

	/**
	 * 标签切换
	 */
	callback = key => {
		this.setState({
			tabKey: key
		})
	}
	
	/**
	 * 
	 * @param {*} e 获取用户名和密码
	 */
	handleSumbit = param => {
		console.log(param)
		if (this.state.tabKey === '1') this.loginUser(param);
		if (this.state.tabKey === '2') this.loginCode(param);
	}

	/**
	 * 账号登录，获取token存在redux
	 * @param { username, password} param 用户名 密码
	 */
	async loginUser(param) {
		try {
			const res = await login(param);
			console.log(1111, res)
			const token = res.data.access_token;
			Cookies.set('token', token);
			this.props.dispatch(setToken(token));
			localStorage.setItem("username", param.username)
			this.props.history.push('/');
		} catch(err) {
			if (err === '[ 主播 ] 才能够登录系统') {
				this.props.history.push('/registered');
			}
		}
	}

	/**
	 * 短信验证码登录
	 * @param {*} mobile 
	 * @param {*} param 
	 */

	async loginCode(param) {
		try {
			const params = {
				mobile: param.username,
				code: param.code
			}
			const res = await loginSMS(params);
			const token = res.data.access_token;
			Cookies.set('token', token);
			this.props.dispatch(setToken(token));
			localStorage.setItem("username", params.username)
			this.props.history.push('/');
		} catch(err) {
			if (err === '[ 主播 ] 才能够登录系统') {
				this.props.history.push('/registered');
			}
		}
	}

	/**
	 * 跳转注册
	 */
	registed = () => {
		this.props.history.push('/registered');
	}

	/**
	 * 忘记密码
	 */
	forgetPassowrd = () => {
		this.props.history.push('/forgetPassowrd');
	}

	render() {
		return (
			<div className="login-warpper">
				<div className="login">
				<div className="login-header">
					<div className="login-logo">
						<img src={logo} alt=" " />
					</div>
					<span className="login-title">今球主播助手</span>
				</div>
				<div className="login-content">
				<Tabs defaultActiveKey="1" onChange={this.callback}>
					<TabPane tab="账号登录" key="1">
						<LoginAccoutForm forgetPassowrd={this.forgetPassowrd} getParams={this.handleSumbit} registered={this.registed} />
					</TabPane>
					<TabPane tab="验证码登录" key="2">
						<LoginCodeForm forgetPassowrd={this.forgetPassowrd} checkCodeFun={sms} getParams={this.handleSumbit} registered={this.registed} />
					</TabPane>
				</Tabs>
				</div>
			</div>
			</div>
		)
	}
}

Login = connect()(Login)

export default Login;
