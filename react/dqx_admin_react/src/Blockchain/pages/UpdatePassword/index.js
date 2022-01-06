import React from 'react';
import { Button, message } from 'antd';
import { updatePassword } from '../../api/user';

import LimitInput  from '../../../component/LimitInput';

class UpdatePassword extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			oldPassword: '',
			newPassowrd: '',
			confirmPassowrd: ''
		}
	}

	/**
	 * 得到旧密码
	 */
	handleOldPassword = e => {
		this.setState({
			oldPassword: e
		})
	}

	/**
	 * 得到新密码值
	 * @param {*} e 
	 */
	handleNewPassowrd = e => {
		this.setState({
			newPassowrd: e
		})
	}

		/**
	 * 得到确认密码值
	 * @param {*} e 
	 */
	handleConfirmPassowrd = e => {
		this.setState({
			confirmPassowrd: e
		})
	}
		/**
	 * 确认
	 */
	handleSumbit = () => {
		if (this.state.oldPassowrd === '' || this.state.newPassowrd === '' || this.state.confirmPassowrd === '') {
			message.error('密码输入不能为空!')
			return;
		}

		if (this.state.newPassowrd.length < 6 || this.state.newPassowrd.length >= 16 || this.state.confirmPassowrd.length < 6 || this.state.confirmPassowrd.length >= 16 )  {
			message.error('新密码必须为6-16位!')
			return;
		}
		
		if (this.state.newPassowrd !== this.state.confirmPassowrd) {
			message.error('两次输入的新密码不一致，请重新输入!')
			return;
		}


		let params = {
			old: this.state.oldPassword,
			password: this.state.confirmPassowrd
		}

		updatePassword(params).then(res => {
			message.success('密码修改成功！');
			this.props.history.push('/login');
		})
	}

	handleReturn = () => {
		this.props.history.push('/');
	}


  render() {
		return (
			<div className="forget-password">
				<h2 className="forget-title">今球区块链后台管理</h2>
				<span className="forget-content-title">修改密码</span>
				<div className="content">
					<div className="item">
						<LimitInput widthValue={400} size="large"  limit={16} value={this.state.oldPassword} getValue={this.handleOldPassword} type="password" regType='pwd' placeholder="旧密码"/>
					</div>
					<div className="item">
						<LimitInput widthValue={400}  size="large" limit={16} value={this.state.newPassowrd} getValue={this.handleNewPassowrd} type="password" regType='pwd' placeholder="新密码"/>
					</div>
					<div className="item">
						<LimitInput widthValue={400} size="large" limit={16} value={this.state.confirmPassowrd} getValue={this.handleConfirmPassowrd} type="password" regType='pwd' placeholder="确认新密码"/>
					</div>
				</div>
				<div className="footer">
					<Button size="large" type="primary" block onClick={this.handleSumbit}>确定</Button>
					<Button className="antd-mt" size="large" type="default" block onClick={this.handleReturn}>返回首页</Button>
				</div>
			</div>
		)
	}
}

export default UpdatePassword;