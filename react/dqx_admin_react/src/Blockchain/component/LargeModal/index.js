import React from 'react';
import moment from 'moment';
import { Row, Col, Button, Modal, message, Input, Table } from 'antd'
import Profit from './profit'
import Withdraw from './withdraw'
import { orderCheckPass, orderCheckDeny} from '../../api/order'

import './style.scss';

const { confirm } = Modal;
const { TextArea } = Input;

class LargeModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			content: ''
		}

		this.statusColor = {
			101: '#04BE34',
			102: '#FC2424',
			1: '#ADADAD',
			100: '#F67223'
		}
 
		this.columns = [
			{
				key: 'createdAt',
        title: '提审时间',
        align: 'center',
        render: (text, item, index) => (
          <span>{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
        ),
				sorter: (a, b) => a.createdAt - b.createdAt
			},
			{
				key: 'status',
        title: '提审状态',
        align: 'center',
				render: (text, record, index) => (
          <span style={{color: this.statusColor[record.status.value]}}>
            {record.status.display}
          </span>
        )
			},
			{
				key: 'id',
        title: '提审单号',
        align: 'center',
        dataIndex: 'id'
			},
			{
				key: 'price',
        title: '提审金额',
        align: 'center',
				render: (text, item, index) => (
          <span>{Number(item.price) / 100}</span>
        ),
				sorter: (a, b) => a.price - b.price
			}
		]
	}

	
  /**
   * 驳回原因
   */
  contentChange = (e) => {
    this.setState({
      content: e.target.value
    })
  }

	/**
* 通过提现
*/
	checkPass = () => {
		let _this = this;
		confirm({
			content: '确定核对无误后点击确定结束当前审核任务',
			okText: '确认',
			onOk() {
				orderCheckPass(_this.props.data.id).then(_ => {
					message.info('审核通过');
					_this.props.refresh()
				})
			},
			onCancel() {
				_this.setState({
					visible: false
				})
			},
		});
	}

	/**
	 * 驳回提现
	 */
	onOk = () => {
		orderCheckDeny(this.props.data.id,{value : this.state.content}).then(_ => {
			this.setState({
				visible: false,
				content: ''
			})
			message.info('驳回审核');
			this.props.refresh()
		})
	}

	/**
	 * 驳回弹窗
	 */
	checkDeny = () => {
		this.setState({
			visible: true
		})
	}

	/**
	 * 关闭弹窗
	 */
	closeModal = () => {
		this.setState({
			visible: false
		})
	}

	render() {
		return (
			<div className="income-modal">
				{/* <Row justify="space-around" align="middle">
					<Col>提审时间：{this.props.data.createdAt}</Col>
					<Col>提审状态：{this.props.data.status.display}</Col>
					<Col>提审单号：{this.props.data.id}</Col>
					<Col>提审金额：{this.props.data.price / 100}</Col>
				</Row> */}
				<Table className="income-modal-table" rowKey="id"
          columns={this.columns} dataSource={[this.props.data]} pagination={false}
				 />
				{
					this.props.data.status.value === 102 ? (
						<Row justify="start">
							<Col>
							驳回原因：
							</Col>
							<Col>
							{this.props.data.denyReason}
							</Col>
						</Row>
					) : null
				}
				{
					this.props.data.status.value === 100 ? (
						<Row justify="center">
							<Button className="income-modal-btn" type="default" style={{ marginRight: 180 }} onClick={this.checkDeny}>驳回</Button>
							<Button className="income-modal-btn" type="primary" onClick={this.checkPass}>通过</Button>
						</Row>
					) : null
				}
				<Row className="income-modal-list" justify="space-between">
					<Col>
						<Profit id={this.props.data.buyer.id}/>
					</Col>
					<Col>
						<Withdraw id={this.props.data.buyer.id}/>
					</Col>
				</Row>
				<Modal
					title='驳回原因'
					visible={this.state.visible}
					onCancel={this.closeModal}
					onOk={this.onOk}
				><TextArea placeholder="请输入驳回原因" rows="6" value={this.state.content} onChange={this.contentChange} maxLength={60}></TextArea>
				</Modal>
			</div>
		)
	}
}
export default LargeModal