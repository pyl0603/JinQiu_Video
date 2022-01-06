import React from 'react';
import { Form, Input, Button, Modal, message } from 'antd';

import { sms } from '../../api/user';

import LimitFormItem from '../../../component/LimitFormItem';

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 },
};

const { confirm } = Modal;

class BasicMes extends React.Component {
	formRef = React.createRef();
	constructor(props) {
		super(props)
		this.state = {
			isSend: this.props.currentValue == null ? false : true,
			userid: '',
			isregister: false,
			isShow: false
		}
	}

	/**
	 * 发送验证码
	 */
	handleSendCode = () => {
		const allParams = this.formRef.current.getFieldsValue();
		if (allParams['mobile'] == null) {
			message.error('请填写手机号！');
			return
		}
		if (allParams['mobile'].length !== 11) {
			message.error('请输入11位手机号');
			return
		}
		sms({ mobile: allParams['mobile'] }).then(res => {
			message.success('发送短信验证码成功！');
			this.setState({
				isSend: true
			})
			if (res.data) {
				this.formRef.current.setFieldsValue({ nickname: res.data.nickname })
				this.setState({
					userid: res.data.id,
					isShow: true
				})
			} else {
				this.setState({
					isregiste: true
				})
			}
		})
	}


	render() {
		return (
			<div className="basic-messgae">
				<h2 className="registered-title">基本信息</h2>
				<div style={{ marginLeft: '-100px' }}>
					<Form ref={this.formRef}
						initialValues={this.props.currentValue}
					>
						<LimitFormItem
							label="手机号码"
							name="mobile"
							regType="number"
							message='请输入11位手机号!'
							limit={11}
						/>
						<Form.Item
							className="code"
						>
							<LimitFormItem
								name="code"
								regType="number"
								label="短信验证"
								message='请输入4位验证码!'
								limit={4}
							/>
							<Button className="antd-ml8" onClick={this.handleSendCode} style={{marginLeft:'calc(50% - 138px)',marginTop:'-3px'}}>
								发送验证码
								</Button>
						</Form.Item>
						{
							this.state.isShow ?
								<>
									<Form.Item
										name="nickname"
										label="昵称"
									>
										<Input size="large" maxLength={16}/>
									</Form.Item>
									<LimitFormItem
										name="password"
										regType="pwd"
										label="设置密码"
										message='请输入6-16位密码!'
										limit={16}
									/>
										<LimitFormItem
										name="confirmpassword"
										regType="pwd"
										label="确认密码"
										message='请输入6-16位密码!'
										limit={16}
									/>
								</>
								:
								null
						}
					</Form>
					{/* <div className="item">
						<label>手机号码</label>
						<Input value = { this.state.phone } onChange = {this.handleChangePhone} onBlur={this.handleBlurPhone}/>
					</div>
					<div className="item">
						<label>短信校验码</label>
						<Input value = { this.state.code }/>
						<Button className="antd-ml8">发送验证码</Button>
					</div>
					<div className="item">
						<label>昵称</label>
						<Input />
					</div>
					<div className="item">
						<label>设置密码</label>
						<Input.Password />
					</div>
					<div className="item">
						<label>确认密码</label>
						<Input.Password />
					</div> */}
				</div>
			</div>
		)
	}
}

export default BasicMes;
