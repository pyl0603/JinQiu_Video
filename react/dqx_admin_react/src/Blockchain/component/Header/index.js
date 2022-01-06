import React from 'react';
import { Layout, Avatar, Dropdown, Menu } from 'antd';
import { UserOutlined, BellOutlined, WalletFilled } from '@ant-design/icons';
import moment from 'moment';
import {
	MenuUnfoldOutlined,
	MenuFoldOutlined
} from '@ant-design/icons';
import Cookies from "js-cookie";
import { withRouter } from 'react-router-dom';

import { loginout, userInfo } from '../../api/user';
import { getFundOrder } from '../../api/order'

import ic_tc from '../../img/ic_tc.png';
import ic_xiugaicode from '../../img/ic_xiugaicode.png';

import './style.scss';

const { Header } = Layout;

class Head extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			collapsed: false,
			isLogin: true,
			total: 0,
			data: [],
			isShow: false,
			username: '',
			avatar: ''
		}
		this.username = localStorage.getItem('username')
	}

	/**
	 * 控制导航栏开关
	 */
	toggleCollapsed = () => {
		this.setState({
			collapsed: !this.state.collapsed,
		});

		this.props.getCollapsed(this.state.collapsed)
	};

	/**
	 * 展开更多
	 */
	showMore = () => {
		let isShow = !this.state.isShow
		this.setState({
			isShow: isShow
		})
	}

	/**
	 * 点击前往新提现页面
	 */
	goWithdraw = () => {
		this.setState({
			isShow: false
		})
		this.props.history.push('/withdrawal/new');

	}

	/**
	 * 
	 */
	async loginout() {
		await loginout();
		localStorage.removeItem('username');
		localStorage.removeItem('type');
		Cookies.remove('token');
		Cookies.remove('Category');
		this.setState({
			isLogin: false
		})
		this.props.history.push('/Login');
	}

	async userInfo() {
		const res = await userInfo();
		this.setState({
			username: res.data.nickname,
			avatar: res.data.avatar
		})
	}

	/**
	 * 挂载
	 */
	async componentDidMount() {
		if (Cookies.get('token')) {
			this.userInfo()
			let res = await getFundOrder({ page: 1,page_size: 5, status: 100 });
			this.setState({
				data: res.data,
				total: res.meta.pagination.total
			})
		}
	}

	changeMenu = ({key}) => {
		console.log(key === '1')
		if (key === '1') {
			this.props.history.push('/updatePassword')
		}
		if (key === '2') {
			this.loginout()
		}
	}

	render() {
		const menu = (
			<Menu onClick={this.changeMenu}>
				<Menu.Item key="1"><i className="header-icon"><img src={ic_xiugaicode} /></i><span className="header-icon-txt">修改密码</span></Menu.Item>
				<Menu.Item key="2"><i className="header-icon"><img src={ic_tc} /></i><span className="header-icon-txt">退出登录</span></Menu.Item>
			</Menu>
		)
		return (
			<Header className="site-layout-background">
				<span className="header-trigger" onClick={this.toggleCollapsed}>
					{React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
				</span>
				{/* <div className="header-loginout">
					<Avatar icon={<UserOutlined />} />{this.username}
				</div> */}
				{
					this.state.isLogin ?
						<div className="user-info" style={{ float: 'right' }}>
							<BellOutlined style={{ fontSize: '22px' }} onClick={this.state.total > 1 ? this.showMore : null}/>
							{
								this.state.total > 0 ? <em style={{ display: 'inline-block', position: 'relative', top: '-9px', left: '-8px', color: '#ffffff', fontSize: '12px', background: 'red', borderRadius: '7px', height: '15px', lineHeight: '15px', padding: '0 6px', transform: 'scale(.9)' }}>{this.state.total}</em> : null
							}
							<Dropdown trigger={['click']} overlay={menu} placement="bottomCenter">
								<div className="dropdown-title">
									<div className="avatar"><img src={this.state.avatar} alt="用户头像" /></div>
									<span className="antd-cp">{this.state.username}</span>
								</div>
							</Dropdown>
							{/* <span style={{ marginLeft: '10px', cursor: 'pointer'}} onClick={this.loginout.bind(this)}>修改密码</span> */}
							{/* <span style={{ marginLeft: '10px', cursor: 'pointer' }} onClick={this.loginout.bind(this)}>退出</span> */}
							{
								this.state.isShow ? this.state.data.length > 0 ? <div className="unfinish">
									{this.state.data.map((res, index) => {
										return (
										<div key={index}>
											<em ><WalletFilled style={{ color: '#ffffff', fontSize: '23px' }} /></em>

											<span>
												<span className="items">
													{res.buyer.realName || res.buyer.nickname}
												</span>
												<span style={{ color: '#ADADAD', fontSize: '12px', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
													<span>发起了一笔提现申请</span>
													<span>{moment(parseInt(res.updatedAt)).format('YYYY-MM-DD HH:mm:ss')}</span>
												</span>
											</span>

										</div>)
									})
									}
									<span className="antd-cp" style={{textAlign:'center',display:'block'}} onClick={this.goWithdraw}>前往更多>></span>
								</div> : null
									: null
							}
						</div>
						:
						null
				}
			</Header>
		)
	}
}

Head = withRouter(Head)

export default Head;
