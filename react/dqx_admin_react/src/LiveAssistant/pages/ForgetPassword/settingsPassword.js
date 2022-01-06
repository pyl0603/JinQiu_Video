import React from 'react';
import Cookies from "js-cookie";
import { Input, Button, message } from 'antd';

import SettingPasswordForm  from '../../../component/SettingPassword';

class SettingsPassword extends React.Component {
	constructor(props) {
		super(props)
	}
	/**
	 * 确认
	 */
	handleSumbit = value => {
		let params = {
			...JSON.parse(Cookies.get('forgetPwd')),
			...value
		}

		console.log(params)
		// 清除cookies
		Cookies.remove('forgetPwd')
	}

  render () {
		return (
			<div className="settings-password-warpper">
				<div className="settings-password">
					<h2 className="title">设置新密码</h2>
					<span className="extra">密码长度大于等于6位小于16位</span>
					<div className="content">
						<SettingPasswordForm getParams={this.handleSumbit} />
					</div>
				</div>
			</div>
		)
	}
}

export default SettingsPassword;
