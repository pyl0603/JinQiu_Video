import React from 'react';
import { Input, Button, message } from 'antd';

import { pwdUpdate } from '../../api/user';

class SettingsPassword extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			newPassowrd: '',
			confirmPassowrd: ''
		}
	}

	/**
	 * 得到新密码值
	 * @param {*} e 
	 */
	handleNewPassowrd = e => {
		this.setState({
			newPassowrd: e.target.value
		})
	}

	/**
	 * 得到确认密码值
	 * @param {*} e 
	 */
	handleConfirmPassowrd = e => {
		this.setState({
			confirmPassowrd: e.target.value
		})
	}

	/**
	 * 失焦状态密码长度
	 * @param {*} e 
	 */
	handleBlurNewPassowrd = e => {
		if (e.target.value.length < 6 || e.target.value.length >= 16)  {
			message.error('密码长度大于等于6位小于16位!')
		}
	}

	/**
	 * 失焦状态密码长度
	 * @param {*} e 
	 */
	handleBlurConfirmPassowrd = e => {
		if (e.target.value.length < 6 || e.target.value.length >= 16)  {
			message.error('密码长度大于等于6位小于16位!')
		}
	}

	/**
	 * 确认
	 */
	handleSumbit = () => {
		console.log('确认')
		if (this.state.newPassowrd === '' || this.state.confirmPassowrd === '') {
			message.error('密码输入不能为空!')
			return;
		}
		
		if (this.state.newPassowrd !== this.state.confirmPassowrd) {
			message.error('两次输入的密码不一致，请重新输入!')
			return;
		}

		let params = {
			...this.props.location.query,
			password: this.state.confirmPassowrd
		}

		pwdUpdate(params).then(res => {
			message.success('密码重置成功！');
			this.props.history.push('/login');
		})
	}

	 // 生命周期函数
	componentDidMount() {
		// 接收里面传过来的参数
		console.log(this.props.location.query)
	}

  render () {
		return (
			<div className="settings-password">
				<h2 className="title">设置新密码</h2>
				<span className="extra">密码长度大于等于6位小于16位</span>
				<div className="content">
					<div className="item">
						<Input.Password size="large" placeholder="新密码" value={this.state.newPassowrd} onChange={this.handleNewPassowrd} onBlur={this.handleBlurNewPassowrd} maxLength={15} allowClear />
					</div>
					<div className="item">
						<Input.Password size="large" placeholder="确认新密码" value={this.state.confirmPassowrd} onChange={this.handleConfirmPassowrd} onBlur={this.handleBlurConfirmPassowrd} maxLength={15} allowClear />
					</div>
				</div>
				<div className="footer">
					<Button type="primary" block onClick={this.handleSumbit}>确定</Button>
				</div>
			</div>
		)
	}
}

export default SettingsPassword;
