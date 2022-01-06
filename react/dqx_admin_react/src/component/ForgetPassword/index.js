import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, message } from 'antd';
import LimitFormItem from '../LimitFormItem';

import './style.scss';

const ForgetPasswordForm = (props) => {
	// 绑定新增表单
	const formRef = useRef();

	const [isDisable, setISDisable] = useState(false);	
	const [second, setSecond] = useState(60);	
	const [isStart, setIsStart] = useState(false);	

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
		console.log(params)
		// 返回值
		props.getParams(params)
	}

	const sendCode = async () => {
		const account = formRef.current.getFieldsValue()[props.account]
		if (account == null || account.length !== 11) {
			message.error('请输入11位手机号！');
			return;
		}
		// 发送验证码接口方法
		const params = {
			mobile: account
		}
		const res = await props.checkCodeFun(params);
		message.success('发送短信验证码成功！');
		setIsStart(true)
	}

	const getValueChange = (changedValues, allValues) => {
		const account = allValues[props.account]
		setISDisable(false)
		if (account && account.length === 11) {
			setISDisable(true)
		}
  }
  
  
	useEffect(() => {
    /**
		 * 发送验证码倒计时
		 */
		let timer
		if (isStart && second != 0) {
			timer = setInterval(() => {
				setISDisable(false)
				setIsStart(true)
				setSecond(second => {
					if (second === 1) {
						clearInterval(timer);
						setISDisable(true)
						setIsStart(false)
					}
					return second - 1
				})
			}, 1000)
		}
		return () => {
      // 组件销毁时，清除定时器
      clearInterval(timer)
    };
	}, [isStart])

	return (
		<Form
			ref={formRef}
			name="normal_login"
			className="forgetpwd-form"
			onFinish={handleOk}
			onFinishFailed={handleError}
			onValuesChange={getValueChange}
		>
			<LimitFormItem
				name={props.account}
				regType="number"
				message='请输入11位手机号!'
				limit={11}
				size="large"
			/>
			<Form.Item
				className="check-code"
			>
				<LimitFormItem
					name={props.code}
					regType="number"
					message='请输入验证码!'
					limit={4}
					noStyle={true}
					size="large"
				/>
				<Button className="code-btn" disabled={!isDisable} onClick={() => sendCode()}>{isStart ? second +'s' :'获取验证码'}</Button>
			</Form.Item>
			{
				props.isShowNext
				?
				<Form.Item>
					<Button size="large" type="primary" htmlType="submit" className="forgetpwd-form-button">
						下一步
					</Button>
				</Form.Item>
				:
				<>
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
					<Button style={{marginTop: 20}}  size="large" type="default" className="login-form-button" onClick={props.returnLogin}>
					返回登录
					</Button>
				</Form.Item>
				</>
			}
		</Form>
	)
}

ForgetPasswordForm.defaultProps = {
	account: 'username',
	code: 'code',
	isShowNext: false,
	newPassword: 'password',
	confirmPassword: 'confirmPassword'
}

export default ForgetPasswordForm;