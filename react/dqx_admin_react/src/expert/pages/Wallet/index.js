import React from 'react';
import { Tabs, Button, Modal, Card } from 'antd';

import IncomeTable from './income';
import WithdrawTable from './withdraw';
import WithdrawPopup from './withdrawPopup';

import { wallet, alipay } from '../../api/wallet';

import ic_qb_alipay from '../../img/ic_qb_alipay.png';

import './style.scss';

const { TabPane } = Tabs;

class Wallet extends React.Component {
  constructor(props) {
    super(props)
    this.incomeRef = React.createRef();
    this.withdrawRef = React.createRef();
    this.state = {
      withDrawableMoney: '',
      yesterdayAddMoney: '',
      verifyAlipay: false,
      visible: false
    }
  }

  /**
   * tab切换
   */
  callback = (key) => {
    console.log(key);
    if (key === "1") {
      if (this.incomeRef.current) {
        this.incomeRef.current.getList()
      }
    }
    if (key === "2") {
      if (this.withdrawRef) {
        if (this.withdrawRef.current) {
          this.withdrawRef.current.getList()
        }
      }
    }
  }

  /**
   * 提现到支付宝
   */
  handleWithdraw = () => {
    if (this.state.verifyAlipay) {
      this.setState({
        visible: true
      })
    }

    if (!this.state.verifyAlipay) {
      const modal = Modal.confirm()
      modal.update({
        content: '支付宝未绑定，是否绑定支付宝！',
        okText: '确认',
        onOk: () => {
         window.open('https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2021001140632160&scope=auth_user&redirect_uri=https://api.jinqiulive.com/alipay-auth')
        },
      })
    }
  }

  /**
   * 关闭弹窗
   */
  onCancel = () => {
    this.setState({
      visible: false
    })
  }

  /**
   * 得到剩余额度和昨日收入数据
   */
  async getwallet() {
    const res = await wallet();
    if (res.code === 0) {
      this.setState({
        withDrawableMoney: res.data.withDrawableMoney,
        yesterdayAddMoney: res.data.yesterdayAddMoney,
        verifyAlipay: res.data.verifyAlipay
      })
    }
  }

  /**
   * 获取指定参数值
   */
  getQueryString = (name) => {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let res = this.props.location.search.substr(1).match(reg);
    if (res !== null) return unescape(res[2]);
    return null;
  }

  /**
   * 支付宝认证
   */
  async getAlipay(code) {
    const res = await alipay(code);
    if (res.code === 0) {
      const modal = Modal.info()
      modal.update({
        content: '支付宝绑定成功！',
        okText: '确认',
        onOk: () => {
        },
      })
    } else {
      const modal = Modal.error()
      modal.update({
        content: '支付宝绑定失败！',
        okText: '确认',
        onOk: () => {
        },
      })
    }
    this.props.history.push('/wallet');
  }

  componentDidMount () {
    const auth_code = this.getQueryString('auth_code')
    if (auth_code) {
      this.getAlipay(auth_code)
    }
    this.getwallet();
  }

  render () {
    return (
      <div className="wallet">
        <div className="wallet-header">
          <div className="header-left">
            <h3 className="money-title">我的可用余额</h3>
            <h1 className="money">¥{this.state.withDrawableMoney / 100}</h1>
            <span className="extra">同昨日+{this.state.yesterdayAddMoney / 100}元</span>
          </div>
          <div className="header-right">
            <i className="icon-pay"><img src={ic_qb_alipay} /></i>
            <Button className="icon-pay-button" key="apply" onClick={this.handleWithdraw}>提现到支付宝</Button>
          </div>
          {/* <Button key="wechat">提现到微信</Button> */}
        </div>
        <Tabs onChange={this.callback}>
        <TabPane tab="收益" key="1">
          <IncomeTable ref = {this.incomeRef} />
        </TabPane>
        <TabPane tab="提现" key="2">
          <WithdrawTable  ref = {this.withdrawRef} />
        </TabPane>
      </Tabs>
      <Modal
        width="400px"
        visible={this.state.visible}
        footer={null}
        onCancel={this.onCancel}
      >
          <WithdrawPopup withDrawableMoney={this.state.withDrawableMoney / 100} closePop={this.onCancel}/>
      </Modal>
      </div>
    )
  }
}

export default Wallet;
