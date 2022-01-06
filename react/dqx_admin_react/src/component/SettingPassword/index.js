import React, { useRef } from 'react';
import { Form, Input, Button, message } from 'antd';
import LimitFormItem from '../LimitFormItem';

const SettingPasswordForm = (props) => {
	// 绑定新增表单
	const formRef = useRef();

	/**
   * 校验失败的回调
   */
  const handleError = () => {
    message.error('有内容未填写!');
	}
	
	/**
   * 校验通过的回调
   */
	const handleOk = () => {
		const params = formRef.current.getFieldsValue()
		const newPassword = params.password
		const confirmPassword = params.confirmPassword
		if (newPassword === '' || confirmPassword === '') {
			message.error('密码输入不能为空!')
			return;
		}
		
		if (newPassword !== confirmPassword) {
			message.error('两次输入的密码不一致，请重新输入!')
			return;
		}
		// 返回值
		props.getParams(params)
	}

	return (
		<Form
			ref={formRef}
			name="normal_login"
			className="login-form"
			onFinish={handleOk}
      onFinishFailed={handleError}
		>
			<LimitFormItem
				name={props.newPassword}
				regType="pwd"
				message='请输入6-16位密码!'
				placeholder="新密码"
				pattern={new RegExp(/[A-Za-z0-9]{6,16}/, 'g')}
				limit={16}
				size="large"
			/>
			<LimitFormItem
				name={props.confirmPassword}
				regType="pwd"
				message='请输入6-16位密码!'
				placeholder="确认新密码"
				pattern={new RegExp(/[A-Za-z0-9]{6,16}/, 'g')}
				limit={16}
				size="large"
			/>
			<Form.Item>
				<Button size="large" type="primary" htmlType="submit" className="login-form-button">
					确认
				</Button>
			</Form.Item>
		</Form>
	)
}

SettingPasswordForm.defaultProps = {
	newPassword: 'password',
	confirmPassword: 'confirmPassword'
}

export default SettingPasswordForm;