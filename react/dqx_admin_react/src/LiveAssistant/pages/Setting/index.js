import React from 'react';
import { connect } from "react-redux";
import { Form, Button, Input, message, Radio, Menu, Col, Row  } from 'antd';

import UploadImage from '../../../component/UploadImage';
import BasicVerified from '../../../component/BasicVerified';
import EditPasswordForm from '../../../component/EditPassword';

import { latestApplication, userInfo, editAvatar, editBase, resetPwd } from '@liveapi/user';
import { setUserName } from '../../redux/actions';
import './style.scss';

const { SubMenu } = Menu;
const { TextArea } = Input;

class Setting extends React.Component {
	constructor(props) {
		super(props)
		// 绑定新增表单
		this.formRef = React.createRef();
		this.state = {
			imgUrl: '',
			current: '1',
			data: {},
			editApprove: {},
			initbasie: {},
			editInit: false,
			needCheck: false
		}
	}

	/**
	 * 获取头像地址
	 * @param {*} url 
	 */
	handleAvatar = url => {
		this.setState({
			imgUrl: url
		}, () => {
			editAvatar({avatar: this.state.imgUrl}).then(_ => {
				message.success('上传头像成功，请等待审核！')
				this.getUserMsg()
			})
		})
	}

  componentDidMount () {
	}
	
	//如果有异步设置state值的情况，在组件销毁时清除所有的state状态
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return
		}
	}

	/**
	* 提交审核
	*/
	handleOk = () => {
		const params = this.formRef.current.getFieldsValue()
		editBase(Object.assign(params)).then(_ => {
			message.success('更新设置成功！')
			this.props.dispatch(setUserName(params.nickname))
			this.getUserMsg()
		})
	}

	/**
	 * 导航栏点击
	 */
	handleClick = e => {
		this.setState({
			current: e.key
		})
	};
	
	/**
	 * 修改密码
	 */
	handleEditPwd = (params) => {
		this.setState({
			editInit: false
		})
		const data = {
			old: params.oldPassword,
			password: params.password
		}
		resetPwd(data).then(_ => {
			this.setState({
				editInit: true
			})
			message.success('修改密码成功')
		})
	}

	/**
	 * 获取用户信息
	 */
	async getUserMsg() {
		const res = await userInfo()
		this.formRef.current.setFieldsValue(Object.assign({},res.data, {gender: res.data.gender.value}))
		this.setState({
			imgUrl: res.data.avatar,
			initbasie: Object.assign({},res.data, {gender: res.data.gender.value}),
			needCheck: res.data.needCheck // 图像是否审核
		})
		this.getPersonMsg(res.data.id)
	}

	/**
	 * 获取认证信息
	 */
	async getPersonMsg(userId) {
		const res = await latestApplication(userId)
		this.setState({
			editApprove: res.data
		})
	}

	componentDidMount() {
		// 得到用户信息
		this.getUserMsg()
	}


  render () {
		const { current } = this.state
		return (
			<div className="live-settings">
				<Row>
					<Col flex="0 1 240px">
						<Menu
							onClick={this.handleClick}
							style={{ width: 200 }}
							defaultSelectedKeys={['1']}
							mode="inline"
						>
								<Menu.Item key="1">基础设置</Menu.Item>
								<Menu.Item key="2">修改密码</Menu.Item>
								<Menu.Item key="3">实名认证</Menu.Item>
						</Menu>
					</Col>
					<Col flex="1 1 200px">
						<div className="live-settings-content">
						{
							current === '1'
							?
							<div className="basic-settings">
								<Form
										ref={this.formRef}
										name="form"
										className="basic-settings-form"
										onFinish={this.handleOk}
										initialValues={this.state.initbasie}
										>
										<div className="content">
											<Form.Item label="头像">
													<UploadImage disabled={this.state.needCheck} needCheck={this.state.needCheck} defaultImg={this.state.imgUrl} isCoverImg={true} isShowRemove={false} isShowLoading={false} styles={{width: 140, height: 140}} url="https://dev.jinqiulive.com/front-tools/oss/token?type=video" getImgUrl={this.handleAvatar} />
												</Form.Item>
											<Form.Item name='nickname' label="昵称">
													<Input maxLength={15}/>
												</Form.Item>
												<Form.Item name="gender" label="性别">
													<Radio.Group>
														<Radio value={1}>男</Radio>
														<Radio value={2}>女</Radio>
													</Radio.Group>
												</Form.Item>
												<Form.Item name='introduction' label="主播简介">
													<TextArea maxLength={50}/>
												</Form.Item>
										</div>
										<Form.Item className="basic-settings-form-button-group">
											<Button size="large" type="primary" htmlType="submit" className="basic-settings-form-button">
												更新设置
											</Button>
										</Form.Item>
									</Form>
								</div>
								:null
							}
							{
								current === '2'
								?
								<EditPasswordForm isShowLabel={true} getParams={this.handleEditPwd} isRest={this.state.editInit}/>
								:
								null
							}
							{
								current === '3'
								?
								<BasicVerified isEdit ={true} isShowLabel={true} data={this.state.editApprove} />
								:
								null
							}
						</div>
					</Col>
				</Row>
			</div>
		)
  }
}
Setting = connect()(Setting)
export default Setting;
