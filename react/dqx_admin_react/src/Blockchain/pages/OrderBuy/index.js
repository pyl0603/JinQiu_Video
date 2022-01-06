import React from 'react';

import OrderTable from '../../component/OrderTable';

class OrderBuy extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      statusList:[
        {name:'全部订单',value: '-1'},
        {name:'等待支付',value: '0'},
        {name:'支付成功',value: '1'},
        {name:'取消',value: '3'},
        {name:'已结算',value: '5'}
      ],
      data: [
        {
          id: 1,
          secondLevelModule: 1,
          title: '测试'
        }
      ]
    }
  }


  /**
   * 获取列表
   * @param {*} 
   */
  async getList() {
    console.log('获取列表')
  }

  componentDidMount() {
    this.getList();
  }


  render() {
    return (
      <div>
        <OrderTable statusList={this.state.statusList} url='/expert-case-orders' type={2} isOrder={true} buy={true} data={this.state.data}/>
      </div>
    )
  }
}

export default OrderBuy;
