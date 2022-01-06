import React from 'react';
import moment from 'moment';
import { Table, Row, Col } from 'antd'
import { getFundOrder, ordersStats } from '../../api/order'

class Withdraw extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			pageIndex: 1,
			pageSize: 5,
			total: 0,
			data: [],
			fundMoney: 0
		}
	}

	statusColor = {
		101: '#04BE34', // 审核通过
		102: '#FC2424', // 驳回
		1: '#ADADAD',  // 成功
		100: '#F67223' // 提现审核中
	}

	componentWillMount() {
		this.getList()
		this.ordersStatus()
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.id !== nextProps.id) {
			this.setState({
				pageIndex: 1
			}, () => {
				this.getList(nextProps.id)
				this.ordersStatus(nextProps.id)
			})
		}

	}


	/**
	* 翻页
	* @param {*} page 
	*/
	changePage = (page) => {
		this.setState({
			pageIndex: page
		}, () => {
			this.getList()
		})
	}

	/**
	 * 获取提现列表
	 */
	async getList(e) {
		let val = e ? e : this.props.id
		let data = {
			page: this.state.pageIndex,
			buyer: val,
			page_size: 5
		}
		getFundOrder(data).then(res => {
			this.setState({
				data: res.data,
				pageIndex: res.meta.pagination.currentPage,
				pageSize: res.meta.pagination.perPage,
				total: res.meta.pagination.total
			})
		})
	}

		/**
	 * 总收益总收入
	 * @param {*} e 
	 */
	async ordersStatus(e) {
		let val = e ? e : this.props.id
		const res = await ordersStats(val)
		this.setState({
			fundMoney: res.data.fund.rmb
		})
	}

	render() {
		const columns = [
			{
				title: '提审时间',
				align: 'center',
				dataIndex: 'createdAt',
        render: (text, item, index) => (
          <span>{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
        ),
        sorter: (a, b) => a.createdAt - b.createdAt
			},
			{
				title: '提现金额',
				align: 'center',
				render: (text, item, index) => (
					<span>{item.price / 100}</span>
				),
				sorter: (a, b) => a.price - b.price
			},
			{
				title: '提现状态',
				align: 'center',
				render: (text, item, index) => (
					<span style={{ color: this.statusColor[item.status.value] }}>{item.status.display}</span>
				)
			}
		]
		return (
			<div style={{ width: '25vw' }}>
				<Row className="income-modal-list-title" justify="space-between">
					<Col>提现记录</Col>
					<Col>总提现：<span className="income-modal-money">￥{this.state.fundMoney}</span></Col>
				</Row>
				<Table columns={columns} dataSource={this.state.data} rowKey="id"
					pagination={{
						total: this.state.total,
						pageSize: this.state.pageSize,
						current: this.state.pageIndex,
						onChange: this.changePage,
						showSizeChanger: false
					}}
				/>
			</div>
		)
	}
}
export default Withdraw