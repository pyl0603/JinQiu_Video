import React from 'react';
import { Steps, Button, message, Modal, Result, Row } from 'antd';

import BasicMes from './basicMes';
import RealName from './realName';

import { pwdUpdate, apply, isRegister, isApply } from '../../api/user';

import './style.scss';

const { Step } = Steps;
const { confirm } = Modal;

class Registered extends React.Component {
  BasicRef = React.createRef();  
  RealRef = React.createRef(); 
  constructor(props) {
    super(props)
		this.state = {
      current: 0,
      basicMes: null,
      realMes: null,
      visible: false,
      seconds: 10
    };
    this.steps = [
      {
        title: '实名认证',
       // content: <RealName ref = {this.RealRef} />,
      },
      {
        title: '提交审核',
       // content: '提交审核',
      },
    ];
	}

  /**
   * 下一步
   * 
   */
	next() {
		const current = this.state.current + 1;
		this.setState({ current });
    // if (this.state.current === 0) {
    //   const basicMes = this.BasicRef.current.formRef.current.getFieldsValue()
    //   const isSend = this.BasicRef.current.state.isSend
    //   const userId = this.BasicRef.current.state.userid
    //   const isregiste = this.BasicRef.current.state.isregiste
    //   Object.assign(basicMes, {userId: userId})
    //   if (!isSend) {
    //     message.error('请发送验证码并填写正确的短信验证码！')
    //     return
    //   }
    //   for (let prop in basicMes) {
    //     if (prop === 'phone') {
    //      // const rep = /^1[3|4|5|7|8][0-9]\d{8}$/
    //       if(basicMes[prop].length !== 11) {
    //         message.error('请输入11位手机号！')
    //         return
    //       }
    //     }
    //     if (basicMes['password'] !== basicMes['confirmpassword']) {
    //       message.error('两次密码输入不一致！')
    //       return
    //     }
    //     if (basicMes[prop] == null || basicMes[prop] === '') {
    //       message.error('请填写完整的基础信息！')
    //       return
    //     }
    //   }
    //   if (isregiste) {
    //     let _this = this;
		// 		confirm({
		// 			content: '当前手机号未注册今球账号，是否直接使用当前，手机号注册今球账号？',
		// 			cancelText: '取消',
		// 			okText: '是',
		// 			onOk() {
		// 				const params = _this.BasicRef.current.formRef.current.getFieldsValue();
    //         isRegister(params).then(_ => message.success('注册今球账号成功！'));
    //         _this.BasicRef.current.state.isShow = true;
		// 			},
		// 			onCancel() {
		// 				_this.BasicRef.current.current.resetFields()
		// 			},
		// 		});
    //   } else {
    //     this.setState({
    //       basicMes
    //     })
    //     let params = {
    //       id: basicMes.userId,
    //       password: basicMes.password,
    //       mobile: basicMes.mobile,
    //       nickname: basicMes.nickname,
    //       code: basicMes.code
    //     }

    //     isApply({userId: basicMes.userId}).then(res => {
    //       if (!res.data.flag) {
    //         message.error(res.data.msg);
    //       } else {
    //         pwdUpdate(params).then(res => {
    //           if (res.code === 0) {
    //             this.setState({ current });
    //           }
    //         })
    //       }
    //     })
    //   }
		// }
  }

  /**
   * 上一步
   */
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
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
   * 提交审核
   */
  handleConfim() {
    const current = this.state.current + 1;
    if (this.state.current === 1) {
      let params = {
        ...this.state.realMes,
        ...this.state.basicMes
      }
      apply(params).then(res => {
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
  }

  /**
   * 立即返回登录页面
   */
  handleReturn = () => {
    this.props.history.push('/login')
  }

  componentDidMount () {
  }

  getRealValue = val => {
    this.setState({
      realMes: val,
      visible: true
    }, () => {
      this.handleConfim()
    })
  }

  //如果有异步设置state值的情况，在组件销毁时清除所有的state状态
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return
    }
  }

  /**
   * 返回登录
   */
  returnLogin() {
    this.props.history.push('/login')
  }

	render () {
		const { current } = this.state;
		return (
			<div className="registered">
        <div className="registered-content">
          <Steps current={current}>
            {this.steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">
						{ current === 0 ?
							<RealName ref = {this.RealRef} getValue={this.getRealValue} current={() => this.next()} />
							:null
            }
            {
              current === 1 ? 
              <>
                <Result
                  status="success"
                  title="已经成功提交审核!"
                  subTitle={`已提交审核，请前往应用市场下载今球App留意审核动向，${this.state.seconds}s后页面将自动跳动到登录页.`}
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
                <p>已提交审核，请前往应用市场下载今球App留意审核动向！</p>
            </Modal>
              </>
              :null
            }
          </div>
          {/* <div className="steps-action">
            {current < this.steps.length - 1 && current !==1 && (
              <>
              <Button size="large" type="default" onClick={() => this.returnLogin()}>
              返回登录
              </Button>
              </>
            )}
             {current < this.steps.length - 1 && current ===1 && (
              <Button size="large" type="primary" onClick={() => this.handleConfim()}>
                提交审核
              </Button>
            )} 
             {current === 1 && (
              <Button size="large" style={{ margin: 8 }} onClick={() => this.prev()}>
                上一步
              </Button>
            )}
          </div> */}
        </div>
			</div>
		)
	}
}

export default Registered;
