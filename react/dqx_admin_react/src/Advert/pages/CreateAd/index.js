import React from 'react';
import { Row, Col, Input, Select, Radio, Button, message, InputNumber } from 'antd';

import UploadImg from './uploadImg';
import Phone from '@component/Phone';
import Preview from '@component/Preview';
import './style.scss';

import { getAdGroup, getAdModule, getAdStyles, addAds } from '@api/createAd.js';
import { getAdvSingleDetails, updateAdvSingleDetails } from '@api/advGroup.js';

import LimitInput from '../../../component/LimitInput';

const { Option } = Select;


// class Board extends React.Component {
// 	render(){
// 		return <Square value={i} />
// 	}
// }


// class banner extends React.Component {
// 	render() {
// 		return <li>Hello,Md Fuck！</li>
// 	}
// }











class CreateAd extends React.Component {
	constructor(props) {
		super(props)
		const id = this.props.location.search.split('=')[1];
		this.state = {
			id: id,
			adGroup: [],
			adGroupCurren: undefined,
			etGroup: [],
			etCurren: 1,
			emissionModal: [],
			emissionPage: [],
			emissionModalCurrent: undefined,
			emissionPageCurrent: undefined,
			emissionPageName: undefined,
			adTitle: '',
			styleArr: [
				{ label: '比赛', value: 2 },
				{ label: '视频', value: 3 },
				{ label: '文章', value: 1 },
				{ label: '帖子', value: 5 },
				{ label: '方案', value: 6 },
				{ label: '外部链接', value: 4 },
				{ label: '直播间', value: 7 }
			],
			radioCurrent: undefined,
			propsTest: '测试父类',
			link: '',
			isHasTitle: false,
			isHasAdSign: true,
			isSupportMovingImage: true,
			isSupportStaticImage: true,
			isTransversePaved: false,
			imgStyles: [],
			preview: [],
			urlType: '',
			urlTypeId: 4,
			editId: id == null ? null : id,
			isEdit: id == null ? false : true,
			time: 3,
			isCurrentLink: true,
			isUploadImg: false,
			platform: 0
		};
	}

	/**
	 * 选择广告组
	 * @param {string} current 
	 */
	handleAdGroup = (current) => {
		this.setState({
			adGroupCurren: current
		})
	}

	/**
	 * 选择体育
	 * @param {string} current 
	 */
	handleEt = (current) => {
		const arr = this.getChildrenArr(current, this.state.etGroup)
		this.setState({
			etCurren: current,
			emissionModalCurrent: undefined,
			emissionModal: arr
		})
	}

	/**
	 * 根据选择投放模块显示对应显示投放页面组
	 * @param {string} current 
	 */
	handleEmissionModal = (current) => {
		this.setState({
			emissionModalCurrent: current
		})
		const arr = this.getChildrenArr(current, this.state.emissionModal)
		this.setState({
			emissionPageCurrent: arr[0] ? arr[0].id : undefined,
			emissionPageName: arr[0] ? arr[0].name : undefined,
			emissionPage: arr,
			preview: []
		})
		this.getAdStyle(arr[0].id)
	}

	/**
	 * 选择当前投放页面
	 * @param {string} current 
	 */
	handleEmissionPage = (current) => {
		let obj = this.state.emissionPage.find(item => item.id === current)
		let name = null
		obj ? name = obj.name : name = undefined
		this.setState({
			emissionPageCurrent: current,
			emissionPageName: name,
			imgStyles: [],
			preview: []
		})
		this.getAdStyle(current)
	}

	/**
	 * 广告样式 - 标题
	 * @param {event} e - 当前节点
	 */
	changeTitle = e => {
		this.setState({
			adTitle: e.target.value
		})
	}

	/**
	 * 投放平台 - 当前单选项
	 * @param {event} e - 当前节点
	 */
	handleChangeRadio = e => {
		this.setState({
			radioCurrent: e.target.value
		})
	}

	/**
	 * 链接
	 * @param {event} e - 当前节点
	 */
	handleChangeLink = e => {
		e.target.value = e.target.value.replace(/\s*/g, '').replace(/[\u4E00-\u9FA5]/g, '')
		this.setState({
			link: e.target.value
		})
	}

	/**
	 * 启动页的时间限制
	 * @param {*} value 
	 */
	handleChangeTime = value => {
		console.log(value)
		this.setState({
			time: value === '' ? null : Number(value)
		})
	}

	/**
	 * 链接输入框失去焦点校验
	 * @param {event} e -当前节点
	 */
	async onBlur(e) {
		let objName = '外链';
		let urlTypeId = 4;
		e.target.value = e.target.value.replace(/\s*/g, '').replace(/[\u4E00-\u9FA5]/g, '')
		let pret = /^(http|https):\/\//;
		if (!pret.test(e.target.value)) {
			message.error('链接开头必须是http://或者https:// !');
			this.setState({
				isCurrentLink: false,
				urlType: ''
			})
			return
		}

		if (e.target.value.indexOf('bball.html') > -1) {
			objName = '篮球赛事';
			urlTypeId = 2;
		}
		if (e.target.value.indexOf('fball.html') > -1) {
			objName = '足球赛事';
			urlTypeId = 2;
		}
		if (e.target.value.indexOf('article.html') > -1) {
			objName = '文章';
			urlTypeId = 1;
		}
		if (e.target.value.indexOf('video.html') > -1) {
			objName = '视频'
			urlTypeId = 3;
		}
		if (e.target.value.indexOf('discusses.html') > -1) {
			objName = '帖子';
			urlTypeId = 5;
		}
		if (e.target.value.indexOf('live.html') > -1) {
			objName = '直播间';
			urlTypeId = 7;
		}
		this.setState({
			urlType: objName,
			urlTypeId: urlTypeId,
			isCurrentLink: true
		})
	}

	/**
	 * 提交/保存至草稿箱
	 * @param {Number} e -0:草稿箱,1:发布
	 */
	async handleSumbit(e) {
		const images = [];
		// 获取resId:https://m.jinqiulive.com/article.html?id=47333
		let category, resId = null;
		resId = this.state.link.split('?id=')[1];
		if (this.state.link.indexOf('bball.html') > -1) {
			category = 1;
		}
		if (this.state.link.indexOf('fball.html') > -1) {
			category = 0;
		}
		this.state.preview.map(res => {
			images.push({ styleId: res.id, url: res.url })
		})
		// images.push({styleId: 1,url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585113244806&di=071cdeae5f2a06c02301f9a89a8ee5b4&imgtype=0&src=http%3A%2F%2Fimg03.sogoucdn.com%2Fapp%2Fa%2F200678%2F14946752041891.jpg'})
		// images.push({styleId: 2,url: 'https://bkimg.cdn.bcebos.com/pic/a08b87d6277f9e2f89e8a1d71f30e924b999f314?x-bce-process=image/watermark,g_7,image_d2F0ZXIvYmFpa2U4MA==,xp_5,yp_5'})
		if (e === 1) {
			if (this.isEmpty()) {
				return;
			}
		} else if (e === 0) {
			if (this.state.adGroupCurren == null) {
				message.error('请选择广告组！');
				return;
			} else if (this.state.emissionModalCurrent == null) {
				message.error('请选择投放模块！');
				return;
			} else if (this.state.emissionPageCurrent == null) {
				message.error('请选择投放页面！');
				return;
			}
		}
		let data = {
			clientType: this.state.platform,
			category: category,
			groupId: this.state.adGroupCurren,
			isPublished: e,
			moduleId: this.state.emissionPageCurrent,
			resType: this.state.urlTypeId,
			resUrl: this.state.link,
			title: this.state.adTitle,
			images: images,
			timeout: this.state.time
		}
		if (resId) {
			Object.assign(data, { resId: Number(resId) })
		}
		addAds(data).then(_ => {
			if (e === 0) {
				message.info('保存草稿箱')
				this.props.history.push('/AdGroup/draftBox')
			}
			if (e === 1) {
				message.info('添加成功')
				this.props.history.push(`/AdGroup/details?id=${this.state.adGroupCurren}`)
			}
		})
	}

	/**
	 * 编辑
	 * @param {*} e 
	 */
	async handleEdit(e) {
		//	const isSumbit = this.isEmpty();
		const images = [];
		// 获取resId:https://m.jinqiulive.com/article.html?id=47333
		let category, resId = null;
		resId = this.state.link.split('?id=')[1];
		if (this.state.link.indexOf('bball.html') > -1) {
			category = 1;
		}
		if (this.state.link.indexOf('fball.html') > -1) {
			category = 0;
		}
		this.state.preview.map(res => {
			images.push({ styleId: res.id, url: res.url })
		})
		if (e === 1) {
			if (this.isEmpty()) {
				return;
			}
		} else if (e === 0) {
			if (this.state.adGroupCurren == null) {
				message.error('请选择广告组！');
				return;
			} else if (this.state.emissionModalCurrent == null) {
				message.error('请选择投放模块！');
				return;
			} else if (this.state.emissionPageCurrent == null) {
				message.error('请选择投放页面！');
				return;
			}
		}

		let data = {
			clientType: this.state.platform,
			category: category,
			groupId: this.state.adGroupCurren,
			isPublished: e,
			moduleId: this.state.emissionPageCurrent,
			resType: this.state.urlTypeId,
			resUrl: this.state.link,
			title: this.state.adTitle,
			images: images,
			timeout: this.state.time
		}
		if (resId) {
			Object.assign(data, { resId: Number(resId) })
		}
		updateAdvSingleDetails(this.state.id, data).then(_ => {
			if (e === 0) {
				message.info('修改成功,保存为草稿箱')
				this.props.history.push('/AdGroup/draftBox')
			}
			if (e === 1) {
				message.info('修改成功')
				this.props.history.push(`/AdGroup/details?id=${this.state.adGroupCurren}`)
			}
		})
	}

	// /**
	//  * 根据菜单名跳转到菜单中
	//  * @param {*} obj 
	//  * @param {*} value 
	//  * @param {*} compare 
	//  */
	// findKeys = (obj ,value, compare = (a, b) => a === b) => {
	// 	return Object.keys(obj).find(k => compare(obj[k], value))
	// }

	hanedImg = (val, current) => {
		let obj = {
			id: current.id,
			name: current.name,
			title: this.state.adTitle,
			x: current.xpixel,
			y: current.ypixel,
			url: val == null ? null : val
		}
		let array = this.state.preview;
		const isobj = array.find((item, index) => index === current.index);
		array.forEach((item, index) => {
			if (index === current.index) {
				item.url = val
			}
		})
		if (val == null) {
			this.state.imgStyles.forEach((item, index) => {
				if (index === current.index) {
					item.url = val
				}
			})
		}
		if (isobj === undefined) {
			array.push(obj);
		}
		this.state.preview = this.state.preview.filter((item, index) => item.url !== null);
		if (current.id === 6 && this.state.preview.length >= 1) {
			this.setState({
				isUploadImg: true
			})
		} else if (this.state.preview.length === this.state.imgStyles.length) {
			this.setState({
				isUploadImg: true
			})
		} else {
			this.setState({
				isUploadImg: false
			})
		}
	}

	/**
	 * 提交时候判断
	 */
	isEmpty = () => {
		let isSumbit = false
		if (this.state.adGroupCurren == null) {
			message.error('请选择广告组！')
			isSumbit = true
		} else if (this.state.etCurren == null) {
			message.error('请选择投放体育模块！')
			isSumbit = true
		} else if (this.state.emissionModalCurrent == null) {
			message.error('请选择投放模块！')
			isSumbit = true
		} else if (this.state.emissionPageCurrent == null) {
			message.error('请选择投放页面！')
			isSumbit = true
		} else if (this.state.adTitle === '' || this.state.adTitle == null) {
			message.error('请填写标题！')
			isSumbit = true
		} else if (this.state.link === '' || this.state.link == null) {
			message.error('请填写链接！')
			isSumbit = true
		} else if (!this.state.isCurrentLink) {
			message.error('链接开头必须是http://或者https:// !');
			isSumbit = true
		} else if (!this.state.isUploadImg) {
			message.error('请上传图片');
			isSumbit = true
		} else if (this.state.emissionPageCurrent === 12 && this.state.time == null) {
			message.error('请输入时间');
			isSumbit = true
		}

		return isSumbit;
	}

	/**
	 * 多维数组
	 * @param {Number} id 
	 * @param {Array} data 
	 */
	getChildrenArr = (id, data) => {
		const obj = data.find(item => item.id === id)
		return obj && obj.children ? obj.children : []
	}

	/**
	 * 上传图片显示的样式
	 * @param {*} data 
	 */
	getImgStyle = (data) => {
		let style = {
			width: data.xpixel / 3,
			height: data.ypixel / 3
		}
		return style
	}

	/**
	 * 判断编辑时候，链接类型
	 * @param {*} id 
	 * @param {*} category 
	 */
	getLinkName = (id, category = null) => {
		let name
		switch (id) {
			case 1:
				name = '文章'
				break;
			case 2:
				if (category == 0) {
					name = '足球赛事'
				}
				if (category == 1) {
					name = '篮球赛事'
				}
				break;
			case 3:
				name = '视频'
				break;
			case 4:
				name = '外链'
				break;
			case 5:
				name = '帖子'
				break;
			case 7:
				name = '直播间'
				break;
			default:
				break;
		}

		return name;
	}

	componentDidMount() {
		if (this.state.isEdit) {
			this.handleSingEdit(this.state.editId)
		} else {
			this.getAdGroups();
			this.getAdModules();
		}
	}

	/**
	 * 获取广告组
	 */
	async getAdGroups() {
		const params = {
			status: 1,
			clientType: this.state.platform  // 客户端类型：0-APP 1-直播PC端
		}
		const res = await getAdGroup(params);
		this.setState({
			adGroup: res.data,
			adGroupCurren: res.data[0]? res.data.id: undefined,
		})
	}

	/**
	 * 获取模块
	 */
	async getAdModules() {
		const res = await getAdModule(this.state.platform);
		console.log(res,'------------------------------------------');
		
		
		const arr = this.getChildrenArr(res.data[0]? res.data[0].id: undefined, res.data)
		this.setState({
			etCurren: res.data[0]? res.data[0].id: undefined,
			etGroup: res.data,
			emissionModal: arr
		})
	}

	/**
	 * 获取投放页面对应样式
	 */
	async getAdStyle(id) {
		const res = await getAdStyles(id);
		const data = res.data;
		console.log('获取投放页面对应样式', data)
		this.setState({
			isHasTitle: data[0].isHasTitle,
			imgStyles: data,
			emissionPageCurrent: id
		})
	}


	/**
	 * 编辑单个
	 * @param {*} id 
	 */
	async handleSingEdit(id) {
		const res = await getAdvSingleDetails(id);
		console.log('获取广告详情', res.data, res.data.group.clientType.value)
		const data = res.data
		// const arr = this.getChildrenArr(data.firstLevelModuleId, this.state.etGroup)
		// const secondArr = this.getChildrenArr(data.secondLevelModuleId, arr)
		let images = data.images
		if (images.length < 3 && images[0] && images[0].style && images[0].style.id === 6) {
			let obj = {}
			Object.assign(obj, images[0])
			obj.url = null
			const newArry = new Array(3 - images.length).fill(obj)
			images = images.concat(newArry)
		}
		let ImgArr = []
		let ImgStyles = []
		images.forEach((item, index) => {
			let obj = {
				id: item.style.id,
				name: item.style.name,
				title: item.title == null ? '' : item.title,
				x: item.style.xpixel,
				y: item.style.ypixel,
				url: item.url
			}
			let newObj = {
				id: item.style.id,
				name: item.style.name,
				isHasTitle: item.style.isHasTitle,
				isHasAdSign: item.style.isHasAdSign,
				isSupportMovingImage: item.style.isSupportMovingImage,
				isSupportStaticImage: item.style.isSupportStaticImage,
				isTransversePaved: item.style.isTransversePaved,
				ypixel: item.style.ypixel,
				xpixel: item.style.xpixel,
				url: item.url
			}
			const isobj = ImgArr.find((temp, i) => i === index);
			const isnewobj = ImgStyles.find((temp, i) => i === index);
			if (isobj === undefined) {
				ImgArr.push(obj)
			}
			if (isnewobj === undefined) {
				ImgStyles.push(newObj)
			}
		})

		this.setState({
			platform:data.group.clientType.value,
			// emissionModal: arr,
			adGroupCurren: data.groupId,
			etCurren: data.firstLevelModuleId,
			emissionModalCurrent: data.secondLevelModuleId,
			// emissionPage: secondArr,
			emissionPageCurrent: data.thirdLevelModuleId,
			adTitle: data.title,
			link: data.resUrl,
			urlTypeId: data.resType,
			urlType: this.getLinkName(data.resType, data.category),
			isHasTitle: ImgStyles[0] ? ImgStyles[0].isHasTitle : null,
			imgStyles: ImgStyles,
			preview: ImgArr,
			time: data.timeout,
			isUploadImg: data.images.length > 0? true:false
		}, () => {
			this.getEditGroup()
		})
	}

	/**
	 * 得到
	 * @param {*} current 
	 */
	getEditGroup = () => {
		this.getAdGroups();
		let arr;
		let secondArr;
		 getAdModule(this.state.platform).then(res => {
			arr = this.getChildrenArr(this.state.etCurren, res.data)
			secondArr = this.getChildrenArr(this.state.emissionModalCurrent, arr)
			this.setState({
				etGroup: res.data,
				emissionModal: arr,
				emissionPage: secondArr
			})

		});
		
	}

	/**
	 * 选择平台
	 */
	handlePlatform = (current) => {
		this.setState({
			platform: current,
			emissionModalCurrent: undefined,
			emissionPageCurrent: undefined,
		}, () => {
			this.getAdGroups()
			this.getAdModules()
		})
	}

	  //如果有异步设置state值的情况，在组件销毁时清除所有的state状态
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return
		}
	}

	render() {
		return (
			<div className="create-ad">
				<Row>
					<Col span={8}>
						<Row align="middle" justify="center">
							<Preview isHasTitle={this.state.isHasTitle} reviewTxt={this.state.adTitle} preview={this.state.preview} />
						</Row>
						{/* <Phone reviewTxt={this.state.adTitle} preview={this.state.preview} /> */}
					</Col>
					<Col span={14}>
						<div className="content-change">
						<Row align="middle" justify="center">
								<Col flex="100px">
									<label>投放平台：</label>
								</Col>
								<Col flex="auto">
									<Select className="antd-mr antd-ml8" defaultValue={0} value={this.state.platform} onChange={this.handlePlatform}>
										<Option key={0} value={0}>APP</Option>
										<Option key={1} value={1}>直播PC端</Option>
									</Select>
								</Col>
							</Row>
							<Row align="middle" justify="center">
								<Col flex="100px">
									<label>选择广告组：</label>
								</Col>
								<Col flex="auto">
									<Select placeholder="请选择" value={this.state.adGroupCurren} onChange={this.handleAdGroup}>
										{
											this.state.adGroup.map((item, index) => {
												return <Option key={index} value={item.id}>{item.name}</Option>
											})
										}
									</Select>
								</Col>
							</Row>
							<Row align="middle" justify="center">
								<Col flex="100px">
									<label>投放体育模块：</label>
								</Col>
								<Col flex="auto">
									<Select defaultValue={1} value={this.state.etCurren} onChange={this.handleEt}>
										{
											this.state.etGroup.map((item, index) => {
												return <Option key={index} value={item.id}>{item.name}</Option>
											})
										}
									</Select>
								</Col>
							</Row>
							<Row align="middle" justify="center">
								<Col flex="100px">
									<label>投放模块：</label>
								</Col>
								<Col flex="auto">
									<Select placeholder="请选择" value={this.state.emissionModalCurrent} onChange={this.handleEmissionModal}>
										{
											this.state.emissionModal.map((item, index) => {
												return <Option key={index} value={item.id}>{item.name}</Option>
											})
										}
									</Select>
								</Col>
							</Row>
							{
								this.state.emissionModalCurrent === '' || this.state.emissionModalCurrent == null ?
									null
									:
									<Row align="middle" justify="center">
										<Col flex="100px">
											<label>投放页面：</label>
										</Col>
										<Col flex="auto">
											<Select value={this.state.emissionPageCurrent} onChange={this.handleEmissionPage}>
												{
													this.state.emissionPage.map((item, index) => {
														return <Option key={index} value={item.id}>{item.name}</Option>
													})
												}
											</Select>
										</Col>
									</Row>
							}
							<Row>
								<Col flex="100px">
									<label>广告样式</label>
								</Col>
							</Row>
							<Row align="middle" justify="center">
								<Col flex="100px">
									<label>标题：</label>
								</Col>
								<Col flex="auto">
									<Input value={this.state.adTitle} onChange={this.changeTitle} allowClear  maxLength={30}/>
								</Col>
							</Row>
							{/* <Row align="middle" justify="center">
								<Col flex="1">
								</Col>
								<Col flex="auto">
									<Radio.Group name="radiogroup" value={this.state.radioCurrent} onChange={this.handleChangeRadio}>
										{
											this.state.styleArr.map((item, index) => {
											return <Radio key={index}  value={item.value}>{item.label}</Radio>
											})
										}
									</Radio.Group>
								</Col>
							</Row> */}
							<Row align="middle" justify="center">
								<Col flex="100px">
									<label>链接：</label>
								</Col>
								<Col flex="auto">
									<Input value={this.state.link} onChange={this.handleChangeLink} onBlur={this.onBlur.bind(this)} allowClear />
								</Col>
							</Row>
							<Row>
								<Col flex="100px">
									<label>链接类型：</label>
								</Col>
								<Col flex="auto">
									{this.state.urlType}
								</Col>
							</Row>
							<Row align="middle" justify="center">
								<Col flex="100px">
									<label>图片：</label>
								</Col>
								<Col flex="auto">
									{
										this.state.emissionPageCurrent === '' || this.state.emissionPageCurrent == null
											?
											null
											:
											this.state.imgStyles.map((item, index) => {
												return <div className="image-style" key={index}>
													<div style={this.getImgStyle(item)} className="upload-img">
														<UploadImg id={index} edit={this.state.isEdit} current={Object.assign(item, { index: index })} getImgUrl={this.hanedImg} getStyle={this.getImgStyle(item)} />
													</div>
													<div className="antd-ml8">
														建议上传尺寸（比例 1：{(item.ypixel / item.xpixel).toFixed(2)}）
														<div>长：{item.xpixel}，宽：{item.ypixel}</div>
													</div>
												</div>
											})
									}
								</Col>
							</Row>
							{
								// 是否是启动页
								this.state.emissionPageCurrent === 12
									?
									<Row align="middle" justify="center">
										<Col flex="100px">
											<label>输入时间：</label>
										</Col>
										<Col flex="auto">
											{/* <InputNumber min={1} max={30} value={this.state.time} onChange={this.handleChangeTime} /> s */}
											<LimitInput widthValue={88} value={3} getValue={this.handleChangeTime} regType='number' /> s
								</Col>
									</Row>
									:
									null
							}
							<Row align="middle" justify="center">
								<Col>
									{
										this.state.isEdit
											?
											<Button type="default" onClick={this.handleEdit.bind(this, 0)}>
												保存草稿箱
										 </Button>
											:
											<Button type="default" onClick={this.handleSumbit.bind(this, 0)}>
												保存草稿箱
										 </Button>
									}
									{
										this.state.isEdit
											?
											<Button style={{ marginLeft: 12 }} type="default" onClick={this.handleEdit.bind(this, 1)}>
												发布
             		 		</Button>
											:
											<Button style={{ marginLeft: 12 }} type="default" onClick={this.handleSumbit.bind(this, 1)}>
												发布
             		 	</Button>
									}
								</Col>
							</Row>
						</div>
					</Col>
				</Row>
			</div >
		)
	}
}

export default CreateAd;