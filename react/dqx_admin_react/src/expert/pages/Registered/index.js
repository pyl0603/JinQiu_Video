import React, { useRef, useEffect, useState } from 'react';
import { Steps, Button, message, Modal, Result, Row } from 'antd';
import Cookies from "js-cookie";
import RealName from './realName';

import { pwdUpdate, apply, isRegister, isApply } from '../../api/user';

import './style.scss';

const { Step } = Steps;
const { confirm } = Modal;

const Registered = (props) => {
	// 当前step
	const [current, setCurrent] = useState(0);
	// 弹窗是否关闭
	const [visible, setVisible] = useState(false);
	// 10s倒计时
	const [seconds, setSeconds] = useState(undefined);

	const steps = [
		{
			title: '实名认证',
		},
		{
			title: '提交审核',
		},
	];

	/**
   * 立即返回登录页面
   */
  const handleReturn = () => {
    props.history.push('/login')
	}
	
	/**
	 * 得到实名认证的内容
	 */
	const getRealValue = val => {
		let params = {}
		Object.assign(params,JSON.parse(Cookies.get('userinfo')), val);
		apply(params).then(res => {
			if (res.code === 0) {
				setCurrent(preCureent => preCureent + 1);
				setVisible(true);
				setSeconds(10);
				Cookies.remove('userinfo');
			}
		})
	}

	/**
	 * isStart判断倒计时是否开始
	 * seconds显示秒数
	 */
	useEffect(() => {
		/**
		 * 倒计时
		 */
		if (seconds) {
			let timer
			if (seconds != 0) {
					timer = setTimeout(() => {
						setSeconds(second => {
							return second - 1
						})
						if (seconds === 1) {
							clearInterval(timer);
							props.history.push('/login');
						}
					}, 1000)
			}
			return () => {
				// 组件销毁时，清除定时器
				clearInterval(timer)
			};
		}
	}, [seconds])

	useEffect(() => {
		// 得到mobile userId
		if (props.location.params) {
			Cookies.set('userinfo', props.location.params);
		}
	}, [])

	return (
		<div className="registered">
			<div className="registered-content">
				<Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
				<div className="steps-content">
					{
						current === 0
						?
						<RealName getValue={getRealValue}  />
						:
						<>
              <Result
                  status="success"
                  title="已经成功提交审核!"
                  subTitle={`已提交审核，请前往应用市场下载今球App留意审核动向，${seconds}s后页面将自动跳动到登录页.`}
                  extra={[
                    <Button key="return" onClick={handleReturn}>立即返回</Button>,
                  ]}
                />
                <Modal
                visible={visible}
                maskClosable={false}
                closable={false}
                footer = {
                  [
                  <Button key="ok" type="primary" onClick={() => {setVisible(false)}}>
                  确认
                  </Button>
                  ]
                }
                >
                <p>已提交审核，请前往应用市场下载今球App留意审核动向！</p>
            </Modal>
            </>
					}
				</div>
			</div>
		</div>
	)
}

export default Registered;
