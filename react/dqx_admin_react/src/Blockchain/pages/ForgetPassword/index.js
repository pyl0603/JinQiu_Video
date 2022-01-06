import React from 'react';
import { Input, Button, message } from 'antd';
import { sms, resetPassword } from '../../api/user';

import LimitInput  from '../../../component/LimitInput';

import './style.scss';

class ForgetPassword extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			phone: '',
			code: '',
			isSend: false,
			newPassowrd: '',
			confirmPassowrd: '',
			isPhone: false,
			isStart: false,
			second: 60
		}
	}

	handlePhone = e => {
		this.setState({
			phone: e
		}, () => {
			this.setState({
				isPhone: false
			})
			if (this.state.phone.length === 11) {
				this.setState({
					isPhone: true
				})
			}
		})
	}

	handleCode = e => {
		this.setState({
			code: e
		})
	}

	async sendCode () {
		let pret = /^1[3|4|5|7|8][0-9]\d{8}$/;
		if (this.state.phone == null || this.state.phone === '') {
			message.error('手机号不能为空！');
			return;
		}
		if (this.state.phone.length !== 11) {
			message.error('请输入11位手机号');
			return
		}
		this.setState({
			isSend: true
		})
		const params = this.state.phone
		const res = await sms(params);
		message.success('发送短信验证码成功！');
		let timer = setInterval(() => {
			this.setState((preState) =>({
				isStart: true,
				isPhone: false,
				second: preState.second - 1,
			}),() => {
				if(this.state.second == 0){
					clearInterval(timer);
					this.setState({
						isPhone: true,
						isStart: false
					})
				}
			});
		}, 1000)
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
		let pret = /^1[3|4|5|7|8][0-9]\d{8}$/;
		if (this.state.phone == null || this.state.phone === '') {
			message.error('手机号不能为空！');
			return;
		}
		if (this.state.phone.length !== 11) {
			message.error('请输入11位手机号');
			return;
		}
		if (this.state.code == null || this.state.code === '') {
			message.error('验证码不能为空！');
			return;
		} 
		// if (!this.state.isSend) {
		// 	message.error('请发送验证码！');
		// 	return;
		// }

		if (this.state.newPassowrd === '' || this.state.confirmPassowrd === '') {
			message.error('密码输入不能为空!')
			return;
		}

		if (this.state.newPassowrd.length < 6 || this.state.newPassowrd.length >= 16 || this.state.confirmPassowrd.length < 6 || this.state.confirmPassowrd.length >= 16 )  {
			message.error('密码必须为6-16位!')
			return;
		}
		
		if (this.state.newPassowrd !== this.state.confirmPassowrd) {
			message.error('两次输入的密码不一致，请重新输入!')
			return;
		}

		this.setState({
			isSend: false
		})

		let params = {
			mobile: this.state.phone,
			code: this.state.code,
			password: this.state.confirmPassowrd
		}

		resetPassword(params).then(res => {
			message.success('密码重置成功！');
			this.props.history.push('/login');
		})
	}

	//如果有异步设置state值的情况，在组件销毁时清除所有的state状态
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return
		}
	}

	handleReturn = () => {
		this.props.history.push('/login');
	}


  render() {
		return (
			<div className="forget-password">
				<h2 className="forget-title">今球区块链后台管理</h2>
				<span className="forget-content-title">忘记密码</span>
				<div className="content">
					<div className="item">
						{/* <Input size="large" placeholder="手机号码" value={this.state.phone} onChange={this.handlePhone} /> */}
						<LimitInput widthValue={400} size="large"  limit={11} value={this.state.phone} getValue={this.handlePhone} regType='number' placeholder="手机号码"/>
					</div>
					<div className="item code">
						<LimitInput widthValue={400} size="large" placeholder="请输入验证码" regType='number' value={this.state.code}  getValue={this.handleCode}/>
						<Button disabled={!this.state.isPhone} onClick={this.sendCode.bind(this)}>{this.state.isStart ? this.state.second +'s' :'获取验证码'}</Button>
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
					<Button className="antd-mt" size="large" type="default" block onClick={this.handleReturn}>返回登录</Button>
				</div>
			</div>
		)
	}
}

export default ForgetPassword;
