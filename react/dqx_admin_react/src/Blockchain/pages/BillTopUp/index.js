import React from 'react';

import OrderTable from '../../component/OrderTable';

class BillTopUp extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      statusList:[
        {name:'全部状态',value: '-1'},
        {name:'充值成功',value: '1'},
        {name:'充值失败',value: '2'},
        {name:'充值超时',value: '4'},
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

	componentDidMount () {
    this.getList();
  }


  render() {
    return (
      <div>
       <OrderTable  statusList={this.state.statusList} url='/recharge-bills' isOrder={false} topup={true} data={this.state.data}  getList={this.getList}/>
      </div>
    )
  }
}

export default BillTopUp;
