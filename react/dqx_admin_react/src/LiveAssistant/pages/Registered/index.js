import React from 'react';
import { Steps, Button, message, Modal, Result, Row, Col, Input } from 'antd';

import {
	LoginCodeForm
} from '../../../component/Login';

import BasicVerified from '../../../component/BasicVerified';
import './style.scss';

import moderated from '../../img/moderated.png';
import { latestApplication, isRegister, sms, apply } from '@liveapi/user';

const { Step } = Steps;

class Registered extends React.Component {
  constructor(props) {
    super(props)
		this.state = {
      current: 0,
      visible: false,
      seconds: 10,
      userId: '',
      isRefuse: false,
      refuseReason: ''
    };
    this.steps = [
      {
        title: '基本信息',
        content: <LoginCodeForm checkCodeFun={sms}  getParams={this.next} isRegistered={true} loginFun={this.handleReturnLogin} />
      },
      {
        title: '实名认证'
      },
      {
        title: '等待审核'
      },
    ];
  }

  /**
   * 是否注册
   * 得到用户id
   */
  getUserMsg = (params) => {
    const data = {
      mobile: params.username,
      code: params.code
    }
    isRegister(data).then(res => {
      this.setState({
        userId: res.data.id
      })
      console.log(111, params)
      this.checkResult(res.data.id, params)
      const current = this.state.current + 1;
      this.setState({ current });
    });
  }
  
  /**
   * 下一步
   */
  next = (params) => {
    this.getUserMsg(params)
  }

    /**
   * 上一步
   */
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  /**
   * 返回登录
   */
  handleReturnLogin = () => {
    this.props.history.push('/login')
  }

  
	/**
	 * 验证结果
	 */
	async checkResult(userId, param) {
		const res = await latestApplication(userId)
		const result = res.data.checkStatus
		// 未审核，等待审核
		if (result.value === 0) {
      const current = 2
      this.setState({ current })
      let timer = setInterval(() => {
        this.setState((preState) =>({
          seconds: preState.seconds - 1,
        }),() => {
          if(this.state.seconds == 0){
            clearInterval(timer);
            this.props.history.push('/login')
          }
        });
      }, 1000)
    }
		// 未通过 驳回
		if (result.value === 2) {
      const current = 1;
      console.log(res.data.refuseReason)
      this.setState({ 
        current: current,
        isRefuse: true,
        refuseReason: res.data.refuseReason
       });
			// this.props.history.push({pathname:'/registered', query: {current: 1, data: res.data}});
		}
	}

  /**
   * 确认审核
   */
  handleSumbit = (params) => {
    console.log(params)
    const current = this.state.current + 1;
    apply(this.state.userId, params).then(res => {
      if (res.code === 0) { 
        this.setState({ current });
        let timer = setInterval(() => {
          this.setState((preState) =>({
            seconds: preState.seconds - 1,
          }),() => {
            if(this.state.seconds == 0){
              clearInterval(timer);
              this.props.history.push('/login')
            }
          });
        }, 1000)
      }
    })
  }

    /**
   * 确认关闭弹窗
   */
  handleOk = () => {
    this.setState({
      visible: false
    })
  }

    /**
   * 立即返回登录页面
   */
  handleReturn = () => {
    this.props.history.push('/login')
  }

	
	render () {
    const { current } = this.state;
		return (
			<div className="registered">
				<Steps current={current}>
          {this.steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">
          <h2 className="steps-content-title">{this.steps[current].title}</h2>
          {
            current === 1
            ?
            <>
               {
                  this.state.isRefuse
                  ?
                  <>
                  <p style={{color: '#ff0000'}}>驳回理由</p>
                  <Input.TextArea className="antd-mb" value={this.state.refuseReason} disabled />
                  </>
                  :
                  null
                }
              <BasicVerified getParams={this.handleSumbit} isEditTxt="提交审核" />
            </>
            :
          current === 2
          ?
          <>
            <Result
              icon={<img src={moderated}  />}
              status="success"
              title="已经成功提交审核!"
              subTitle={`已提交审核，请耐心等待结果，${this.state.seconds}s后页面将自动跳动到登录页.`}
              extra={[
                <Button key="return" onClick={this.handleReturn}>立即返回</Button>,
              ]}
            />
            <Modal
            visible={this.state.visible}
            maskClosable={false}
            closable={false}
            footer = {
              [
              <Button key="ok" type="primary" onClick={this.handleOk}>
              确认
              </Button>
              ]
            }
            >
            <p>已提交审核，请耐心等待结果！</p>
            </Modal>
        </>
        :
        this.steps[current].content
        }
        </div>
        <div className="steps-action">
          {current > 0 && current !== 2 && (
            <Button size="large" style={{ margin: '0 8px' }} onClick={() => this.prev()} className="login-form-button">
              返回上一步
            </Button>
          )}
        </div>
			</div>
		)
	}
}

export default Registered;
