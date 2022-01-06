import React from 'react';
import { message } from 'antd';
import { LoadingOutlined, PlusOutlined, CloseCircleFilled } from '@ant-design/icons';
import Axios from 'axios';

import './style.scss';
import ic_pic from "@img/ic_pic.png";

const $axios = Axios.create()

class UploadImage extends React.Component {
	constructor(props) {
		super(props)
		this.fileRef = React.createRef();
		this.state = {
			upURL: null,
			upStyles: null,
			upText: null,
			upCover: null,
			imageUrl: null,
			loading: false,
			upIsShowRemove: true,
			upIsShowLoading: true,
			upImageType: null
		}
	}

	async postOss(url,data) {
		return new Promise((rec, rej) => {
			$axios.post(url, data).then(res => {
				return rec(res.data)
			}).catch(_ => {
				message.error('接口异常')
			})
		})
	}
	

	/**
	 * 测试环境获取token信息
	 */
	async getToken() {
		return new Promise((rec, rej) => {
			$axios.defaults.baseURL = ''
			$axios.get(this.state.upURL).then(res => {
				return rec(res.data)
			}).catch(_ => {
				message.error('接口异常')
			})
		})
	}

	async upImg(ev) {
		const file = this.fileRef;
		this.setState({
			loading: true
		})
		// 获取token
		let data = await this.getToken();
		const request = new FormData();
		let name = `${data.startsWith}${new Date().getTime()}_${Math.random().toString(36).substr(2)}_${file.current.files[0].name}`
		request.append("OSSAccessKeyId", data.OSSAccessKeyId); // Bucket 拥有者的Access Key Id。
		request.append("policy", data.policy); // policy规定了请求的表单域的合法性
		request.append("signature", data.signature); // 根据Access Key Secret和policy计算的签名信息，OSS验证该签名信息从而验证该Post请求的合法性
		request.append("key", name);
		request.append("expire", data.expire);
		request.append('callback', data.callbackBody)
		request.append("success_action_status", "200"); // 让服务端返回200,不然，默认会返回204
		request.append("file", file.current.files[0]);	
		if (this.state.upImageType !== 'image/*') {
			const isImgType = this.state.upImageType.split(",").find(item => item.trim() === file.current.files[0].type);
			if (!isImgType) {
				message.error(`图像类型只能选择为${this.state.upImageType.replace(/image\//g, '')}的格式`);
				return
			}
		}
		this.postOss(data.host, request).then(res => {
			// 上传成功之后的回调
			if (res.code === 0) {
				let url =`${data.host}\/${name}`
				this.setState({
					imageUrl: url,
					loading: false
				}, () => {
					this.props.getImgUrl(this.state.imageUrl)
				})
			}
		})
	}

	/**
	 * 移除
	 */
	handleRemove = () => {
		this.setState({
			imageUrl: null
		}, () => {
			this.props.getImgUrl(this.state.imageUrl)
		})
	}

	componentDidMount() {
		this.setState({
			upURL: this.props.url,
			upStyles: this.props.styles,
			upText: this.props.text,
			upCover: this.props.cover,
			upIsCoverImg: this.props.isCoverImg,
			upIsShowRemove: this.props.isShowRemove,
			upIsShowLoading: this.props.isShowLoading,
			upImageType: this.props.imageType
		})
	}

	render () {
		const uploadButton = (
      <div className={this.state.upIsCoverImg ? 'upload-button default-cove':'upload-button'}>
        {this.state.upIsShowLoading ? this.state.loading  ? <LoadingOutlined /> : <PlusOutlined />:null}
				{ this.state.upText ? <div className="ant-upload-text">{this.state.upText }</div> : null}
				{this.state.upIsCoverImg ? <img src={ic_pic} />: this.state.upCover ? <img style={{ width: '100%', height: '100%' }} src={this.state.upCover} />:null}
      </div>
    );
		const { imageUrl } = this.state;
		return (
			<div className="upload-image" style={this.state.upStyles}>
				<input
				type="file" id="file" ref={this.fileRef}
				style={{ width: '100%', height: '100%',display: this.props.disabled ? 'none': 'block' }}
				onClick={(event) => { event.target.value = null }}
				onChange={(e) => this.upImg(e)}
				accept={this.state.upImageType}
				/>
				{this.props.needCheck ? <div className="ant-audit"><div className="ant-upload-text">审核中</div></div>:null}
				{ imageUrl || this.props.defaultImg ? <><img className="currentImg" src={imageUrl ? imageUrl : this.props.defaultImg ? this.props.defaultImg: null} alt="image" style={this.state.upStyles} /> { this.state.upIsShowRemove ? <i className="remove antd-cp" onClick={()=> this.handleRemove()}><CloseCircleFilled /></i>: null}</> : uploadButton }
				{/* { !imageUrl && this.props.defaultImg  ? <><img className="currentImg" src={this.props.defaultImg} alt="image" style={this.state.upStyles} /> { this.state.upIsShowRemove ? <i className="remove antd-cp" onClick={()=> this.handleRemove()}><CloseCircleOutlined/></i>: null}</> : uploadButton } */}
			</div>
		)
	}
}

export default UploadImage;

UploadImage.defaultProps = {
	disabled: false, // 不允许编辑
	url: null, // 上传图片地址
	styles: null, // 上传图片样式
	text: null, // 上传图片显示的文字，不传则默认没有
	cover: null, // 上传图片的封面
	isCoverImg: false, // 是否开启上传图片默认的封面，默认不开启, 如果开启默认图片，cover参数失效
	isShowRemove: true, // 是否显示移除图片的功能
	defaultImg: null, // 回传的图片
	isShowLoading: false, // 是否显示加号图标上传时候显示加载
	imageType: 'image/*', // 图像格式
	needCheck: false  // 是否审核中
}
