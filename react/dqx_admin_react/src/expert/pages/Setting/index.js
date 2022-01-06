import React from 'react';
import { connect } from "react-redux";
import { Button, Input, message, Modal, Row } from 'antd';

import UploadImage from '../../../component/UploadImage';

import { wallet } from '../../api/wallet';
import { updatePerson, updateAvatar } from '../../api/settings';
import { setUserName } from '../../redux/actions';
import './style.scss';

const { TextArea } = Input;

class Setting extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			account: '',
			nickname: '',
			introduction: '',
			wechat: '',
			alipay: '',
			isEdit: false,
			imgUrl: '',
			verifyAlipay: false
		}
	}

	/**
	 * 获取头像地址
	 * @param {*} url 
	 */
	handleAvatar = url => {
		this.setState({
			// isEdit: true,
			imgUrl: url
		}, () => {
			updateAvatar({value: this.state.imgUrl}).then(_ => {
				message.success('上传头像成功，请等待审核！')
			})
		})
	}

	/**
	 * 保存
	 */
	handleSave = () => {
		const params = {
			nickname: this.state.nickname,
			//avatar: this.state.imgUrl,
			introduction: this.state.introduction
		}
		updatePerson(params).then(_ => {
			message.success('保存成功！')
			this.props.dispatch(setUserName(this.state.nickname))
		})
	}

		/**
	 * 
	 * @param {*} e 姓名
	 */
	handleChangeName = e => {
		this.setState({
			nickname: e.target.value,
			isEdit: true
		})
	}

	/**
	 * 简介内容
	 */
	handleChangeIntroduction = e => {
		this.setState({
			introduction: e.target.value,
			isEdit: true
		})
	}

	/**
	 * 微信 输入内容
	 */
	handleChangeWechat = e => {
		this.setState({
			wechat: e.target.value
		})
	}

	/**
	 * 支付宝 输入内容
	 */
	handleChangeAlipay = e => {
		this.setState({
			alipay: e.target.value
		})
	}

	/**
	 * 得到个人信息
	 */
	async getwallet() {
    const res = await wallet();
    console.log(res)
    if (res.code === 0) {
			const data = res.data
      this.setState({
        withDrawableMoney: data.withDrawableMoney,
        nickname: data.nickname,
				imgUrl: data.avatar,
				alipay: data.alipayName,
				introduction: data.remark,
				verifyAlipay: data.verifyAlipay,
				account: localStorage.getItem('username')
      })
    }
	}
	
	/**
	 * 弹窗
	 */
	handlePop = () => {
		const modal = Modal.info()
		modal.update({
			content: '支付宝未绑定，请到移动端绑定支付宝！',
			okText: '确认',
			onOk: () => {
			 
			},
		})
	}

  componentDidMount () {
    this.getwallet();
	}
	
	//如果有异步设置state值的情况，在组件销毁时清除所有的state状态
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return
		}
	}

  render () {
		return (
			<>
				<div className="person-settings">
				<div className="person-avatar">
					<UploadImage defaultImg={this.state.imgUrl} isShowRemove={false} isShowLoading={false} styles={{width: 140, height: 140, borderRadius: '50%'}} url="https://dev.jinqiulive.com/front-tools/oss/token?type=video" getImgUrl={this.handleAvatar} text='编辑图像' />
				</div>
				<div className="person-message">
					<div className="content-left">
						<div className="item">
							<label>账号：</label>
							<Input value = { this.state.account }  disabled />
						</div>
						<div className="item">
							<label>昵称：</label>
							<Input value = { this.state.nickname } onChange={this.handleChangeName} maxLength="16" />
						</div>
						<div className="item">
							<label>简介：</label>
							<TextArea value = { this.state.introduction } onChange={this.handleChangeIntroduction} rows={4} />
						</div>
					</div>
					<div className="content-right">
						{/* <div className="item">
							<label>微信：</label>
							<Input value = { this.state.wechat } onChange={this.handleChangeWechat} disabled />
							<Button type="link">未绑定</Button>
						</div> */}
						<div className="item">
							<label>支付宝：</label>
							<div className="apply-input">
								<Input value = { this.state.alipay } onChange={this.handleChangeAlipay} disabled/>
								{
									this.state.verifyAlipay
									?
									<Button className="person-binding" type="link">已绑定</Button>
									:
									<span className="person-no-binding">请前往我的钱包或者今球app绑定支付宝信息</span>
								}
								</div>
							</div>
					</div>
				</div>
				</div>
				{
					this.state.isEdit
					?
					<Row className="person-button" justify="center" style={{marginTop:'25px'}}>
						<Button type="primary" onClick={() => this.handleSave()}>
							保存
						</Button>
					</Row>
					:null
				}
			</>
		)
  }
}
Setting = connect()(Setting)
export default Setting;
