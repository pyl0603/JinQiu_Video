import React from 'react';
import { Form, Input, Button, Table, Modal, message, } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import { usersList, sms, delUsers, addUsers, updatePassword } from '@api/user.js';

import LimitInput from '../../../component/LimitInput';

const { confirm } = Modal;


const layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 16 },
};

class PesrsonManage extends React.Component {
	// 绑定新增表单
	formRef = React.createRef();
	formPwdRef = React.createRef();
	constructor() {
		super()
		this.state = {
			searchlogs: '',
			isAdd: false,
			isEdit: false,
			data: [],
			key: '',
			userId: '',
			pageIndex: 1,
			pageSize: 10,
			total: 0,
			account: '',
			code: '',
			username: '',
			pwd: '',
			repwd: '',
			confirmpwd: ''
		}
		this.columns = [
			{
				key: 'id',
				title: '用户ID',
				align: 'center',
				dataIndex: 'id',
			},
			{
				key: 'nickname',
				title: '用户名称',
				align: 'center',
				dataIndex: 'nickname',
			},
			{
				key: 'mobile',
				title: '手机号码',
				align: 'center',
				dataIndex: 'mobile',
			},
			{
				key: 'type',
				title: '类型',
				align: 'center',
				render: (text, record, index) => (
					<span>{record.adAdmin ? '超级管理员' : '普通后台用户'}</span>
				)
			},
			{
				key: 'action',
				title: '操作',
				align: 'center',
				render: (text, record, index) => (
					<span>
						<Button type="link" style={{ marginRight: 16 }} onClick={() => this.handleEditUser(record, index)}>修改密码</Button>
						<Button type="link" onClick={() => this.handleDelete(record, index)} disabled={record.adAdmin} danger>移除</Button>
					</span>
				)
			}
		];
	}

	/**
	 * e -账号输入框返回值
	 */
	handleChangeAccount = (e) => {
		this.setState({
			account: e
		})
	}

	/**
	 * e -验证码返回值
	 */
	handleChangeCode = (e) => {
		this.setState({
			code: e
		})
	}

	/**
	 * e -密码框返回值
	 */
	handleChangePwd = (e) => {
		this.setState({
			pwd: e
		})
	}


	/**
	 * e -重置密码框返回值
	 */
	handleResetPwd = (e) => {
		this.setState({
			repwd: e
		})
	}

	/**
	 * e -重置密码确认框返回值
	 */
	handleConfirmPwd = (e) => {
		this.setState({
			confirmpwd: e
		})
	}

	/**
	 * 获取后台用户列表
	 */
	async getList() {
		usersList({
			key: this.state.key,
			exact: 0,
			page: this.state.pageIndex,
			page_size: this.state.pageSize
		}).then(res => {
			this.setState({
				data: res.data,
				pageIndex: res.meta.pagination.currentPage,
				pageSize: res.meta.pagination.perPage,
				total: res.meta.pagination.total
			})
		})
	}

	/**
	 * 获取短信验证码
	 */
	async getSms() {
		const data = this.state.account
		if (data.length === 11) {
			sms({ mobile: data }).then(_ => {
				message.info('发送成功')
			})
		} else {
			message.info('请输入11位手机号')
		}
	}

	/**
	 * 搜索框onchange事件
	 * @param {event} e -搜索框
	 */
	async searchKeyInput(e) {
		this.setState({
			key: e.target.value
		})
	}

	/**
	 * - 输入关键字查询
	 */
	handleSearch = () => {
		this.setState({
			pageIndex: 1
		}, () => {
			this.getList()
		})
	}

	/**
	 *  重置搜索框
	 */
	handleRest = () => {
		this.setState({
			key: ''
		}, () => {
			this.getList()
		})
	}

	/**
	 * - 新增用户
	 */
	handleAddUser = () => {
		this.setState({
			isAdd: true
		})
	}


	/**
	 * 
	 * @param {*} e 
	 * 确认新增用户
	 */
	async handleOkAdd() {
		const item = this.formRef.current.getFieldsValue();
		if (this.state.account.length !== 11) {
			message.info('请输入正确账号');
			return
		}
		if (this.state.code.length !== 4) {
			message.info('请输入正确验证码');
			return
		}
		if (!item.nickname) {
			message.info('请输入用户名');
			return
		}
		if (!this.state.pwd) {
			message.info('请输入密码');
			return
		}
		const data = {
			code: this.state.code,
			mobile: this.state.account,
			password: this.state.pwd,
			nickname: item.nickname
		}
		addUsers(data).then(_ => {
			message.info('添加成功');
			this.getList();
			this.formRef.current.resetFields()
			this.setState({
				isAdd: false,
				code: '',
				pwd: '',
				account: ''
			})
		})
	}

	/**
	 * 
	 * @param {*} e 
	 * 取消新增用户
	 */
	handleCancelAdd = e => {
		this.formRef.current.resetFields()
		this.setState({
			isAdd: false
		})
	}

	/**
	 * 修改用户密码
	 * @param {object} data - 获取当前行数据
	 * @param {number} index - 获取当前行数
	 */
	handleEditUser = (data, index) => {
		this.setState({
			isEdit: true,
			userId: data.id
		})
	}

	/**
	 * 
	 * @param {*} e 
	 * 确认修改密码
	 */
	async handleOkEdit() {
		// const data = this.formPwdRef.current.getFieldsValue();
		if (this.state.repwd === ('' || undefined) || this.state.confirmpwd === ('' || undefined)) {
			message.info('请输入两次新密码')
			return
		}
		if (this.state.repwd !== this.state.confirmpwd) {
			message.info('两次输入密码不一致')
			return
		}
		updatePassword(this.state.userId, { password: this.state.repwd }).then(_ => {
			message.info('修改成功');
			this.getList();
			this.setState({
				repwd: '',
				confirmpwd: '',
				isEdit: false
			})
		})
	}

	/**
	 * 
	 * @param {*} e 
	 * 取消修改密码
	 */
	handleCancelEdit = e => {
		this.formPwdRef.current.resetFields()
		this.setState({
			isEdit: false
		})
	}

	/**
	 * 移除用户
	 * @param {object} data - 获取当前行数据
	 * @param {number} index - 获取当前行数
	 */
	handleDelete = (data, index) => {
		let _this = this;
		confirm({
			title: '确定移除该用户？',
			icon: <ExclamationCircleOutlined />,
			content: '移除后将无法登录广告系统，是否确认移除？',
			okText: '移除',
			okType: 'danger',
			cancelText: '取消',
			onOk() {
				delUsers(data.id, { beManager: 0 }).then(_ => {
					message.info('删除成功');
					_this.getList();
				})
			},
			onCancel() {
			},
		});
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
	 * 页面加载
	 */
	componentDidMount() {
		this.getList()
	}

	render() {
		return (
			<div className="person_Manage">
				<div className="header">
					<label>搜索：</label><Input style={{ width: 200 }} placeholder="请输入关键字" allowClear value={this.state.key} onChange={this.searchKeyInput.bind(this)} maxLength={50} />
					<Button type="primary" onClick={this.handleSearch}>查询</Button>
					<Button type="default" onClick={this.handleRest}>重置</Button>
					<Button style={{ float: 'right' }} type="primary" onClick={this.handleAddUser}>新增后台用户</Button>
				</div>
				<Table columns={this.columns} 
				dataSource={this.state.data} rowKey="id"
				pagination = {{
					total: this.state.total,
					pageSize: this.state.pageSize,
					current: this.state.pageIndex,
					onChange: this.changePage,
					showTotal: this.showTotal,
					onShowSizeChange: this.onShowSizeChange
				  }}
				 />
				<Modal
					title="新增后台用户"
					visible={this.state.isAdd}
					onCancel={this.handleCancelAdd.bind(this)}
					onOk={this.handleOkAdd.bind(this)}
				>
					<Form {...layout} ref={this.formRef}>
						<Form.Item label="用户账号">
							<Form.Item
								name="mobile"
								noStyle
							>
								{/* <Input maxLength={11}/> */}
								<LimitInput limit={11} widthValue={350} value={this.state.account} getValue={this.handleChangeAccount} regType='number' placeholder="请输入账号" />
							</Form.Item>
							<Button type="primary" className="antd-ml8" onClick={this.getSms.bind(this)}>
								发送验证码
									</Button>
						</Form.Item>
						<Form.Item
							label="验证码"
							name="code"
						>
							<LimitInput limit={4} value={this.state.code} getValue={this.handleChangeCode} regType='number' placeholder="请输入验证码" />
							{/* <Input maxLength={4}/> */}
						</Form.Item>
						<Form.Item
							label="用户名称"
							name="nickname"
						>
							<Input maxLength={16} placeholder="请输入用户名称" />
						</Form.Item>
						<Form.Item
							label="设置密码"
							name="password"
						>
							<LimitInput limit={16} value={this.state.pwd} getValue={this.handleChangePwd} regType='pwd' placeholder="密码长度设置为6-16" />
						</Form.Item>
					</Form>
				</Modal>
				<Modal
					title="修改密码"
					visible={this.state.isEdit}
					onCancel={this.handleCancelEdit}
					onOk={this.handleOkEdit.bind(this)}
				>
					<Form {...layout} ref={this.formPwdRef}>
						<Form.Item
							label="新密码"
							name="password"
						>
							<LimitInput limit={16} value={this.state.repwd} getValue={this.handleResetPwd} regType='pwd' placeholder="请输入密码" />
						</Form.Item>
						<Form.Item
							label="确认密码"
							name="new_password"
						>
							<LimitInput limit={16} value={this.state.confirmpwd} getValue={this.handleConfirmPwd} regType='pwd' placeholder="请输入密码" />
						</Form.Item>
					</Form>
				</Modal>
			</div>
		)
	}
}

export default PesrsonManage;
