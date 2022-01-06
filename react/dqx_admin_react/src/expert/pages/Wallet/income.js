import React from 'react';
import { Table } from 'antd';
import moment from 'moment';

import { getInCome } from '../../api/wallet';

class IncomeTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }

    this.columns = [
      {
        key: 'payAt',
        title: '收益时间',
        align: 'center',
        render: (text, item, index) => (
          <span>{moment(item.payAt).format('YYYY-MM-DD HH:mm:ss')}</span>
        )
      },
      {
        key: 'account',
        title: '昵称',
        render: (text, item, index) => (
          <span>{item.buyer.nickname}</span>
        ),
				align: 'center'
      },
			{
        key: 'body',
        title: '来源',
        dataIndex: 'body',
				align: 'center'
			},
			{
        key: 'price',
        title: '收入（元）',
        dataIndex: 'price',
        align: 'center',
        render: (text, item, index) => (
          <span>{item.price / 100}</span>
        )
      }
    ];
	}

	/**
   * 翻页
   * @param {*} page 
   */
  changePage = (page) => {
    this.setState({
      pageIndex: page
    })
  }

	/**
   * 改变每页显示条目数
   */
  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
    this.setState({
      pageIndex: current,
      pageSize: pageSize
    }, () => {
      this.getList()
    })
  }

  /**
   * 提示表格共有多少条
   * @param {*} total 
   * @param {*} range 
   */
  showTotal = (total, range) => {
    return `共有${total}条数据，当前每页最多显示${this.state.pageSize}条`
  }

  /**
   * 得到收益数据
   */
	async getList() {
    const res = await getInCome();
    this.setState({
      data: res.data,
    })
	}
		
	componentDidMount () {
		this.getList()
	}
	
	render () {
		return (
			<Table columns={this.columns} dataSource={this.state.data} rowKey="id" 
        pagination = {{
          total: this.state.total,
          pageSize: this.state.pageSize,
          current: this.state.pageIndex,
          onChange: this.changePage,
          showTotal: this.showTotal,
          onShowSizeChange: this.onShowSizeChange
        }}
      />
		)
	}
}

export default IncomeTable;
