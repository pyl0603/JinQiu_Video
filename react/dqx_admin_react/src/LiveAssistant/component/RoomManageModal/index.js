import React from 'react';
import { Input, Button, message } from 'antd';
import { searchMobile } from '../../api/user'

import LimitInput from '../../../component/LimitInput';

import './style.scss';

class RoomManageModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			phone: '',
			userData: {
				nickname: '',
				avatar: '',
				id: '',
				isAdd: true
			}
		}
	}

	/**
	 * 
	 * @param {*} param 
	 */
	handleChangePhone = (e) => {
		this.setState({
			phone: e
		})
	}

	/**
	 * 添加房管
	 */
	addMan = () => {
		this.props.addMan(this.state.userData)
	}

	/**
	 * 查询
	 */
	search = () => {
		searchMobile(this.state.phone).then(res => {
			let ids = []
			this.props.managers.map(res => {
				ids.push(res.userId || res.id)
			})
			if(ids.includes(res.data.id)){
				this.setState({
					isAdd: false
				})
			}
			this.setState({
				userData: res.data
			})
		})
	}


	render() {
		return (
			<div className="room-manage-modal">
				<div className="room-manage-modal-search">
					<LimitInput limit={11} value={this.state.phone} getValue={this.handleChangePhone} regType='number' placeholder="请输入手机号查询" />
					<Button className="antd-ml8" onClick={this.search}>查询</Button>
				</div>
				<div className="room-manage-modal-content">
					{
						this.state.userData.id !== '' ?
							<div className="search-result">
								<i className="search-result-avator">
									<img src={this.state.userData.avatar} alt="头像" />
								</i>
								<span className="search-result-name">{this.state.userData.nickname}</span>
								<Button style={{ float: "right" }} type="link" onClick={this.addMan} disabled={!this.state.isAdd}>{this.state.isAdd ? '添加' : '已添加'}</Button>
							</div>
							:

							<span className="empty-result">未查询到该用户</span>
					}

				</div>
			</div>
		)
	}
}

export default RoomManageModal;
