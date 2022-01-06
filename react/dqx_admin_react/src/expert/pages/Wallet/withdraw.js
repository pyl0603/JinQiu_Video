import React from 'react';
import { Table, Button, Modal, message } from 'antd';
import moment from 'moment';
import { getWithDraw, confirmOrder } from '../../api/wallet';

class WithdrawTable extends React.Component {
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
        key: 'createdAt',
        title: '申请时间',
        render: (text, item, index) => (
          <span>{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
        ),
				align: 'center'
      },
      {
        key: 'id',
        title: '交易单号',
        dataIndex: 'id',
				align: 'center'
      },
      {
        key: 'buyer',
        title: '账户',
        dataIndex: 'account',
        render: (text, item, index) => (
          <span>{item.buyer.nickname}</span>
        ),
				align: 'center'
			},
			{
        key: 'status',
        title: '当前状态',
        align: 'center',
        render: (text, item, index) => (
          <span>{item.status.display}</span>
        )
			},
			{
        key: 'denyReason',
        title: '驳回原因',
        dataIndex: 'denyReason',
				align: 'center'
			},
			{
        key: 'payType',
        title: '到账平台',
        dataIndex: 'payType',
				align: 'center',
        render: (text, item, index) => (
          <span>{item.payType.display}</span>
        )
			},
			{
        key: 'price',
        title: '提现（元）',
				dataIndex: 'price',
				align: 'center',
        render: (text, item, index) => (
          <span>{item.price / 100}</span>
        )
			},
			{
        key: 'action',
        title: '操作',
				dataIndex: 'action',
				align: 'center',
        render: (text, item, index) => (
          <span>
            <Button type="link" disabled={item.status.value !== 101} onClick={() => this.handleCash(item)}>提现</Button>
          </span>
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
   * 提现弹窗详情
   */
	handleCash = (item) => {
    const modal = Modal.confirm()
    modal.update({
      title: '提现金额',
      content: <div className="cash-popup">
        <h3 className="cash-mony">{item.price / 100} 元</h3>
        <div className="cash-content">
          <p>到账平台: {item.payType.display}</p>
          <p>到账账号: {item.buyer.alipayAccount}</p>
          <p>申请时间: {moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
          <p>交易单号: {item.id}</p>
        </div>
      </div>,
      okText: '确认',
      onOk: () => {
        confirmOrder(item.id).then(_ => {
          message.success('提现成功！');
        })
      },
    })
	}

  /**
   * 得到提现列表
   */
  async getList() {
    const res = await getWithDraw();
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

export default WithdrawTable;
