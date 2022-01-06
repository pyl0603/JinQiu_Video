import React from 'react';
import Cookies from "js-cookie";
import { message } from 'antd';
import { sms, checkMobilePwd } from '@liveapi/user';

import ForgetPasswordForm  from '../../../component/ForgetPassword';
import logo from '../../img/logo.png';

import './style.scss';

class ForgetPassword extends React.Component {
	constructor(props) {
		super(props)
	}
		/**
	 * 确认
	 */
	handleSumbit = params => {
		const data = {
			mobile: params.account,
			code: params.code,
			password: params.newPassword
		}

		checkMobilePwd(params.account, data).then(res => {
			message.success('密码重置成功！')
			this.props.history.push('/login')
		})
	}

	/**
	 * 返回
	 */
	handleReturn = () => {
		this.props.history.push('/login')
	}

  render() {
		return (
			<div className="forget-password-warpper">
				<div className="forget-password">
					<div className="forget-password-header">
						<div className="forget-password-logo">
							<img src={logo} alt=" " />
						</div>
						<span className="login-title">今球主播助手</span>
					</div>
					<div className="forget-password-content">
						<div className="forget-password-content-title">忘记密码</div>
						<ForgetPasswordForm checkCodeFun={sms} getParams={this.handleSumbit} returnLogin={this.handleReturn}/>
					</div>
				</div>
			</div>
		)
	}
}

export default ForgetPassword;
