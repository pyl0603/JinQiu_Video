import React from 'react';
import moment from 'moment';
import { Row, Col } from 'antd'

class NormalModal extends React.Component {
  render() {
    const typeName = this.props.isOrder ? '订单' : '账单'
    console.log(this.props.url)
    let type = true
    // 充值订单
    if (this.props.url === '/recharge-orders' || this.props.url === '/recharge-bills') {
      type = true
    }
    // 购买订单
    if (this.props.url === '/expert-case-orders' || this.props.url === '/expert-case-bills') {
      type = false
    }
    let item = this.props.data
    console.log(item)
    const data = [
      { name: '专家', value: item.buyer.nickname },
      { name: `${typeName}号:`, value: item.id },
      { name: `${typeName}状态:`, value: item.status.display },
      { name: '方案标题:', value: type ? '' : item.body },
      { name: '方案单价:', value: type ? '' : item.price },
      // { name: '终端平台', value: '1245157541' },
      { name: '支付方式:', value: item.payType.display },
      { name: '实付金额:', value: type ? item.amount : ''},
      { name: '实付今币:', value: type ? '' : item.amount},
      { name: '优惠券:', value: '-' },
      { name: '获得今币:', value: type ? '' : item.coins },
      { name: '实转现金:', value: type ? '' : item.amount/100 },
      { name: `创建${typeName}时间:`, value: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss') },
      { name: `${typeName}结束时间:`, value: moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss') },
    ]
    return (
      <div>
        {
          data.map((res, index) => {
            if (res.value) {
              return (
                <Row className="normal-modal" justify="space-between" key={index}>
                  <Col className="antd-fw-5">{res.name}</Col>
                  <Col className="antd-fw-3">{res.value}</Col>
                </Row>
              )
            }
          })
        }
      </div>
    )
  }
}
export default NormalModal