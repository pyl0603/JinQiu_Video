import React from 'react';
import { Button, InputNumber, message } from 'antd';

import { fundOrder } from '../../api/wallet';

class WithdrawPopup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isInput: true,
      money: null
    }
  }

  /**
   * 输入提现金额
   */
  changeMoney = e => {
    if (e > Number(this.props.withDrawableMoney)) {
      message.error('提现金额超出可用余额！');
      return;
    }
    this.setState({
      money: e,
      isInput: false
    })
    if (e === 0 || e == null) {
      this.setState({
        isInput: true
      })
    }
  }

  /**
   * 提现全部
   * @param {*} value 
   */
  handleAllMoney = value => {
    this.setState({
      money: Number(value),
      isInput: false
    })
  }

  /**
   * 确认提现
   */
  handleInCome = () => {
    if(this.state.money <= 0){
      message.info('请输入大于0的金额！');
      return
    }
    fundOrder({value: this.state.money * 100}).then(_ => {
      message.success('成功发起提现，请等待审核！');
      this.setState({
        money: null
      })
      this.props.closePop();
    })
  }

  render () {
    return (
      <div className="withdraw-popup">
        <div className="popup-content">
          <div className="content-title">提现金额<span className="txt antd-ml8">提现手续费为：￥0.00</span></div>
          <div className="money">
            <InputNumber value={this.state.money} onChange={this.changeMoney} />
          </div>
          <div className="exta">当前可用余额：{this.props.withDrawableMoney}元<a className="exta-button" onClick={() => this.handleAllMoney(this.props.withDrawableMoney)}>全部提现</a></div>
          <Button className="popup-button" block type="primary" disabled={this.state.isInput} onClick={() => this.handleInCome(this)}>提现</Button>
        </div>
        <div className="txt">
        提现规则：<br />
        1、每天只可提现一次，每天00:00更新提现次数<br />
        2、每次提现今球平台将在2~3个工作日内审核您提交的提现订单，审核通过后，需要您进入提现订单手动提现<br />
        3、提现金额将通过系统消息发放，提交申请后请关注您今球APP的系统消息，点击个人中心-右上角消息 即可找到。<br />
        4、提现暂时只支持支付宝转账，请确保您有支付宝账号，并该账号是您本人的支付宝。<br />
        </div>
      </div>
    )
  }
}

export default WithdrawPopup;

WithdrawPopup.defaultProps = {
  withDrawableMoney: 0
}
