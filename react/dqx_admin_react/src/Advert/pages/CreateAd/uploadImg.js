import React from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ic_pic from "@img/ic_pic.png";
import Axios from 'axios';

import { postOss } from '@api/createAd.js';

const $axios = Axios.create()

class UploadImg extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			imageUrl: undefined,
			edit: this.props.edit
		}
		this.fileRef = React.createRef();
	}

	/**
	 * 测试环境获取token信息
	 */
	async getToken() {
		return new Promise((rec, rej) => {
			$axios.defaults.baseURL = ''
			$axios.get('https://dev.jinqiulive.com/front-tools/oss/token?type=video').then(res => {
				return rec(res.data)
			}).catch(_ => {
				message.error('接口异常')
			})
		})
	}

	async upImg(ev) {
		this.setState({
			edit: false
		})
		const file = this.fileRef;
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
		postOss(data.host, request).then(res => {
			// 上传成功之后的回调
			if (res.code === 0) {
				let url =`${data.host}\/${name}`
				this.setState({
					imageUrl: url
				})
				this.props.getImgUrl(url, this.props.current)
			}
		})

	}

	handleRemove = () => {
		this.setState({
			imageUrl: null
		})
		this.props.getImgUrl(null, this.props.current)
	}

	render() {
		const uploadButton = (
			<div style={{textAlign: "center"}}>
				<div className="img">
					<img src={ic_pic} />
				</div>
			</div>
		);

		const { imageUrl } = this.state;

		return (
			<div className="uploader-warper" >
				<input style={this.props.getStyle} type="file" id="file" ref={this.fileRef}
					onClick={(event) => { event.target.value = null }}
					onChange={(e) => this.upImg(e)} />
				<div style={this.props.getStyle} className="show-image">
				{this.props.current.url && this.state.edit ? <><img src={this.props.current.url} alt="image" style={{ width: '100%', height: '100%' }} /><i className="remove antd-cp" onClick={()=> this.handleRemove()}><CloseCircleOutlined/></i></> 
				:
				imageUrl ? <><img src={imageUrl} alt="image" style={{ width: '100%', height: '100%' }} /><i className="remove antd-cp" onClick={()=> this.handleRemove()}><CloseCircleOutlined/></i></> :uploadButton
				}
				</div>
			</div>
		)
	}
}

export default UploadImg;
