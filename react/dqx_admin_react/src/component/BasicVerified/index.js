import React, { useRef, useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import LimitFormItem from '../LimitFormItem';
import UploadImage from '../UploadImage';

import idfont from '../../img/idfont.png';
import idband from '../../img/idband.png';
import idhand from '../../img/idhand.png';

import './style.scss';

const BasicVerified = (props) => {
	// 绑定新增表单
	const formRef = useRef();
	const [frontImage, setfrontImage] = useState(null);	
	const [backImage, setbackImage] = useState(null);	
	const [handImage, sethandImage] = useState(null);
	
	
	/**
	 * 上传身份证正面
	 */
	const handleIDPositive = url => {
		setfrontImage(url)
	}

	/**
	 * 上传背面身份证照
	 */
	const handleIDBack = url => {
		setbackImage(url)
	}

	/**
	 * 上传手持身份照
	 */
	const handleIDHand = url => {
		sethandImage(url)
	}

	/**
   * 校验失败的回调
   */
	const handleError = () => {
		message.error('有必填内容未填写!');
	}

		/**
	* 提交审核
	*/
	const handleOk = () => {
		const realMes = formRef.current.getFieldsValue()
		if (!frontImage) {
			message.error('请上传身份证正面照！')
			return
		}
		if (!backImage) {
			message.error('请上传身份证背面照！')
			return
		}
		if (!handImage) {
			message.error('请上传手持身份证照！')
			return
		}
		const params = {
			...realMes,
			frontImage: frontImage,
			backImage: backImage,
			handImage: handImage
		}
		props.getParams(params)
	}

	useEffect(() => {
		// 编辑中, 回传数据给表单
		if (props.isEdit) {
			formRef.current.setFieldsValue({
				realName: props.data.realName,
				idcardNo: props.data.idcardNo
			})
			sethandImage(props.data.frontImage)
			setfrontImage(props.data.frontImage)
			setbackImage(props.data.backImage)
		}
	}, [])

	return (
		<Form
			ref={formRef}
			name="verified"
			className="verified-form"
			onFinish={handleOk}
			onFinishFailed={handleError}
			colon={false}
			>
			<Form.Item
				label={props.isShowLabel? '真实姓名': null}
				name="realName"
				rules={[{ required: true, message: '姓名不能为空!' }]}
			>
				<Input size="large" disabled={props.isEdit} placeholder="请输入真实姓名" maxLength={30} />
			</Form.Item>
			<LimitFormItem
				label={props.isShowLabel? '身份证号码': null}
				name="idcardNo"
				regType="id"
				limit={18}
				message="请输入正确的身份证号码"
				placeholder="请输入正确的身份证号码"
				disabled={props.isEdit}
				size="large"
			/>
			<div className="verified-IDCards">
				<p>身份证信息：<span className="extar-idcrads">（照片清晰无遮挡）</span></p>
				<div className="cards-content">
					<div className="cards">
						<UploadImage cover={idfont} isShowRemove={false} disabled={props.isEdit} styles={{ width: 250, height: 158 }} defaultImg={frontImage} url="https://dev.jinqiulive.com/front-tools/oss/token?type=video" getImgUrl={handleIDPositive} isShowLoading={false} />
						<span className="extar-idcrads">{props.isEdit ? '身份证正面':'请上传身份证正面照片'}</span>
					</div>
					<div className="cards">
						<UploadImage cover={idband} isShowRemove={false} disabled={props.isEdit} styles={{ width: 250, height: 158 }} defaultImg={backImage} url="https://dev.jinqiulive.com/front-tools/oss/token?type=video" getImgUrl={handleIDBack} isShowLoading={false} />
						<span className="extar-idcrads">{props.isEdit ? '身份证反面':'请上传身份证反面照片'}</span>
				</div>
					<div className="cards">
						<UploadImage cover={idhand} isShowRemove={false} disabled={props.isEdit} styles={{ width: 250, height: 158 }} defaultImg={handImage} url="https://dev.jinqiulive.com/front-tools/oss/token?type=video" getImgUrl={handleIDHand} isShowLoading={false} />
						<span className="extar-idcrads">{props.isEdit ? '手持身份证':'请上传手持身份证照片'}</span>
					</div>
				</div>
				</div>
			{
				props.isEdit
				?
				null
				:
				<Form.Item>
					<Button size="large" type="primary" htmlType="submit" className="login-form-button">
						{props.isEditTxt}
					</Button>
				</Form.Item>
			}
		</Form>
	)
}

BasicVerified.defaultProps = {
	isEditTxt: '确认',
	isEdit: false,
	realName: '',
	idcardNo: '',
	frontImage: null,
	backImage: null,
	handImage: null,
	isShowLabel: false,
	data: {}
}

export default BasicVerified;

