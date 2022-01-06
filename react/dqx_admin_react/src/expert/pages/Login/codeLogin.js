import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, message } from 'antd';
import LimitFormItem from '../../../component/LimitFormItem';

import { newSMSCode, newSMSLogin } from '../../api/newLogin';

import './style.scss';

const LoginCodeForm = (props) => {
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
		// 登录
		props.codeParams(params);
	}

	/**
	 * 发送验证码
	 */
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
		await newSMSCode(params);
		message.success('发送短信验证码成功！');
		setIsStart(true)
	}

	/**手机号
	 * 字段值更新时触发回调事件
	 * @param {*} changedValues 
	 * @param {*} allValues 
	 */
	const getValueChange = (changedValues, allValues) => {
		const account = allValues[props.account]
		setISDisable(false)
		if (account && account.length === 11) {
			setISDisable(true)
		}
	}

	useEffect(() => {
		/**
		 * 验证码倒计时
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
			className="login-form"
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
				placeholder="手机号码"
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
					placeholder="请输入验证码"
				/>
				<Button  className="code-btn" disabled={!isDisable} onClick={() => sendCode()}>{isStart ? second +'s' :'获取验证码'}</Button>
			</Form.Item>
			<Form.Item>
			    <Button size="large" type="primary" htmlType="submit" className="login-form-button">
					登录
				</Button>
			</Form.Item>
		</Form>
	)
}

LoginCodeForm.defaultProps = {
	account: 'mobile',
	code: 'code'
}

export default LoginCodeForm;
