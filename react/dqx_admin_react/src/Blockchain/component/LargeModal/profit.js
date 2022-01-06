import React from 'react';
import moment from 'moment';
import { Table, Row, Col } from 'antd'
import { getOrder, ordersStats } from '../../api/order'

class Profit extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			pageIndex: 1,
			pageSize: 5,
			total: 0,
			data: [],
			inMoney: 0
		}
	}

	statusColor = {
		5: '#04BE34', // 等待结果
		3: '#FC2424', // 取消
		1: '#ADADAD',  // 成功
		0: '#F67223'  // 等待支付
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
		getOrder('/expert-case-orders', data).then(res => {
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
			inMoney: res.data.in.rmb
		})
	}

	render() {
		const columns = [
			{
				title: '收益时间',
				align: 'center',
				dataIndex: 'updatedAt',
				render: (text, item, index) => (
					<span>{moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
				),
				sorter: (a, b) => a.createdAt - b.createdAt
			},
			{
				title: '收益金额',
				align: 'center',
				render: (text, item, index) => (
					<span>{item.expertAmount / 100}</span>
				),
				sorter: (a, b) => a.expertAmount - b.expertAmount
			},
			{
				title: '收益状态',
				align: 'center',
				render: (text, item, index) => (
					<span style={{ color: this.statusColor[item.status.value] }}>{item.status.display}</span>
				)
			}
		]
		return (
			<div style={{ width: '25vw' }}>
				<Row className="income-modal-list-title" justify="space-between">
					<Col>收益记录</Col>
					<Col>总收益：<span className="income-modal-money">￥{this.state.inMoney}</span></Col>
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
export default Profit