import React, { useState, useEffect, useRef } from 'react';
import { connect } from "react-redux";
import { setToken } from "../../redux/actions";
import store from  '../../redux/store';
import Cookies from "js-cookie";
import { message, Tabs } from 'antd';
import ic_jinqiu from '../../img/ic_jinqiu.png';
import CodeLogin from './codeLogin';
import ScanLogin from './scanLogin';
import openSocket from "socket.io-client";

import { userInfo } from '../../api/user';
import { newSMSLogin, newUserStatus, newNoExpert } from '../../api/newLogin';

import './style.scss';

const { TabPane } = Tabs;

const Login = (props) => {
	//标签
	const [tabKey, setTabKey] = useState('1');
	// 二维码地址
	const [url, setUrl] = useState('');
	// 二维码得到的token
	const [tokenValue, setTokenValue] = useState('');
	// 获取用户验证码
	const [codeParams, setCodeParams] = useState({});

	/**
	 * 标签切换
	 */
	const callback = key => {
		setTabKey(key);
	}

  /**
   * 长连接获取url 扫码登录
   */
  const getCode = () => {
		let socket = openSocket(`https://192.168.1.200?client=admin`);
		socket.on("connect", () => {
			setUrl(`https://192.168.1.200/client-expert/login/generate-qrcode/${socket.id}`);
		});
		socket.on("dqx.auth.scan-login", data => {
			const token = data.token;
			Cookies.set('token', token);
			props.dispatch(setToken(token));
			setTokenValue(token);
		});
	}

	/**
	 * 获取用户验证码
	 * @param {*} params 
	 */
	const getCodeParams = (params) => {
		setCodeParams(params);
	}


	/**
	 * 获取用户信息 -- 判断是否是专家
	 */
	 const getUserInfo = async ()=> {
		const res = await newNoExpert();
		const data = res.data;
		if (data && data.expert) {
			props.history.push('/');
		}
		if (data && !data.expert) {
			const res = await newUserStatus(data.id);
			const status = res.data;
			if (status && status.value === 1) {
				message.info('工作人员正在审核，请耐心等待');
				return;
			}
			if (status && status.value === 3) {
				message.info('很抱歉您的审核未通过（详细原因我们将以短信的形式通知您，请注意查收），请重新提交审核');
			}
			props.history.push({pathname:'/registered', params: {userId: data.id, mobile: data.mobile}});
		}
	}

		/**
	 * 短信验证码登录
	 */
	const loginCode = async () => {
		const res = await newSMSLogin(codeParams);
		const data = res.data;
		if (res.code === 0) {
			const token = data.access_token;
			Cookies.set('token', token, { expires: data.expires_in / 86400 });
			props.dispatch(setToken(token));
			props.history.push('/');
		}
		if (res.code === 996) {
		// 需要判断是否审核中/通过/未通过
			if (data.checkStatus == null) {
				props.history.push({pathname:'/registered', params: {userId: data.userId, mobile: data.mobile}});
				return;
			}
			if (data.checkStatus && data.checkStatus.value === 1) {
				message.info('工作人员正在审核，请耐心等待');
				return;
			}
			if (data.checkStatus && data.checkStatus.value === 3) {
				message.info('很抱歉您的审核未通过（详细原因我们将以短信的形式通知您，请注意查收），请重新提交审核');
			  props.history.push({pathname:'/registered', params: {userId: data.userId, mobile: data.mobile}});
			}
		}
	}

	/**
	 * 切换tab
	 */
	useEffect(() => {
			if (tabKey === '2') {
				getCode();
			}
	}, [tabKey])
	
	/**
	 * 二维码
	 *根据token获取信息
	 */
	useEffect(() => {
		if (tokenValue) {
			getUserInfo()
		}
}, [tokenValue])

	/**
	 * 短信验证码登录
	 *根据短信验证码登录
	 */
	useEffect(() => {
		if (JSON.stringify(codeParams) !== '{}') {
			loginCode()
		}
}, [codeParams])

		return (
			<div className="login">
				<div className="login-header">
					<div className="login-logo">
						<img src={ic_jinqiu} alt=" " />
					</div>
					<span className="login-title">今球专家管理后台</span>
				</div>
				<div className="login-content">
				<Tabs defaultActiveKey="1" onChange={callback}>
					<TabPane tab="验证码登录" key="1">
						<CodeLogin codeParams={getCodeParams} />
						<div className="tips"><i>*</i>未注册今球的用户在这一步将自动帮您注册今球账号，已注册的用户请自行忽略</div>	
					</TabPane>
					<TabPane tab="扫码登录" key="2">
						<ScanLogin url={url} />
					</TabPane>
				</Tabs>
				</div>	
			</div>
		)
}

export default connect()(Login);
