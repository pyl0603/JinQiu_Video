import React from 'react';

import OrderTable from '../../component/OrderTable';

class BillBuy extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      statusList:[
        {name:'全部账单',value: '-1'},
        {name:'已结算',value: '1'},
        {name:'退款',value: '3'},
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
       <OrderTable statusList={this.state.statusList} url='/expert-case-bills' isOrder={false} buy={true} data={this.state.data}  getList={this.getList}/>
      </div>
    )
  }
}

export default BillBuy;
