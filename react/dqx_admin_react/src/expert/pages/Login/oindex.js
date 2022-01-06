import React from 'react';
import { connect } from "react-redux";
import { setToken } from "../../redux/actions";
import Cookies from "js-cookie";

import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import ic_jinqiu from '../../img/ic_jinqiu.png';
import LimitFormItem from '../../../component/LimitFormItem';

import { login } from '../../api/user';

import './style.scss';

class Login extends React.Component {
	formRef = React.createRef();

	/**
	 * 
	 * @param {*} e 获取用户名和密码
	 */
	handleSumbit = e => {
		e.preventDefault();
		const param = this.formRef.current.getFieldsValue();
		this.loginUser(param)
	}

	/**
	 * 请求登录，获取token存在redux
	 * @param { username, password} param 用户名 密码
	 */
	async loginUser(param) {
		const res = await login(param);
		const token = res.data.access_token;
		Cookies.set('token', token, { expires: res.data.expires_in / 86400 });
		this.props.dispatch(setToken(token));
		localStorage.setItem("username", param.username)
		this.props.history.push('/');
	}

	/**
	 * 跳转注册
	 */
	registed() {
		this.props.history.push('/registered');
	}

	/**
	 * 忘记密码
	 */
	forgetPassowrd() {
		this.props.history.push('/forgetPassowrd');
	}

	render() {
		return (
			<div className="login">
				<div className="login-header">
					<div className="login-logo">
						<img src={ic_jinqiu} alt=" " />
					</div>
					<span className="login-title">今球专家管理后台</span>
				</div>
				<div className="login-content">
					<Form
						ref={this.formRef}
						name="normal_login"
						className="login-form"
					>
						<LimitFormItem
							name="username"
							regType="number"
							message='请输入11位手机号!'
							limit={11}
						/>
						{/* <Form.Item
							name="username"
						>
							<Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="账号" />
						</Form.Item> */}
						<LimitFormItem
							name="password"
							regType="pwd"
							message='请输入6-16位密码!'
							limit={16}
						/>
						{/* <Form.Item
							name="password"
						>
							<Input
								prefix={<LockOutlined className="site-form-item-icon" />}
								type="password"
								placeholder="密码"
							/>
						</Form.Item> */}
						{/* <Form.Item>
							<Form.Item name="remember" valuePropName="checked" noStyle>
								<Checkbox>记住密码</Checkbox>
							</Form.Item>

							<a className="login-form-forgot" href="">
								忘记密码
							</a>
						</Form.Item> */}

						<Form.Item>
							<Button size="large" type="primary" htmlType="submit" className="login-form-button" onClick={this.handleSumbit}>
								登录
							</Button>
							<div className="login-form-operate antd-mt">
								<a onClick={this.registed.bind(this)}>申请专家号</a>
								<a onClick={this.forgetPassowrd.bind(this)}>忘记密码</a>
							</div>
						</Form.Item>
					</Form>
				</div>
			</div>
		)
	}
}

Login = connect()(Login)

export default Login;
