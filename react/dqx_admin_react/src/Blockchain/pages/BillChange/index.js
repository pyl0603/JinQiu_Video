import React from 'react';

import OrderTable from '../../component/OrderTable';

class BillChange extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      statusList:[
        {name:'全部状态',value: '5'}
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
        <OrderTable url="/expert-case-bills" isOrder={false} change={true} data={this.state.data} getList={this.getList} />
      </div>
    )
  }
}

export default BillChange;
