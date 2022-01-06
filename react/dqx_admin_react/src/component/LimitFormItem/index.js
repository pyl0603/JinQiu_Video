import React from 'react';
import { Form, Input } from 'antd';

const LimitFormItem = (props) => {
		const {
			widthValue, maxValue, limit, regType, placeholder, type, suffix, prefix, addonAfter, addonBefore, size, disabled,
			label, name, message, extra,pattern
		} = props;
	/**
	 * number -只能输入数字
	 * url -校验不能输入中文
	 * pwd -只能输入数字和英文字母
	 */
	let regRule = {
		'number': () => {
		  return /[^\d]/g
		},
		'url': () => {
		  return /[\u4E00-\u9FA5]/g
		},
		'pwd': () => {
			return /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g
		},
		'id': () => {
			return /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g
		},
		'money': () => {
			return /[^\d./]+/ig
		}
	};

	const setFormatted = text => {
		/**
		 * 数字输入框最大值
		 */
		if (maxValue && regType === 'number') {
 			Number(text) > maxValue ? text = maxValue: text = text
		}
		/**
		 * 金钱输入框不用小数点开头
		 */
		if (maxValue && regType ==='money') {
			text = text.replace(/^\./g,"") // 第一个不是 .
			text = text.replace(/\.{2,}/g,".") // 只出现一个 . 
			text = text.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只出现一个 .
			text = text.replace(/^0{2,}/, "0") // 不能以连续两个00开头
			text = text.replace('0.00', "0.0") // 小数不能不能连续两个00
			Number(text) > maxValue ? text = maxValue: text = text
	 }
		/**
		 * 正则限制
		 */
		text = text.toString().replace(regRule[regType](), '');
		/**
		 * 输入框限制长度，超过设置长度被截取
		 */
		text = text.length > limit ? text.slice(0, limit) :text;
		return text
	};

	return (
		regType === 'pwd'
		?
		<Form.Item 
		label={label}
		name={name}
		extra={extra}
		rules={[{ required: true,pattern: pattern, message: {message} }]}
		style={{width: widthValue}}
		noStyle={props.noStyle}
		normalize={(value, prevValue, prevValues) => { return setFormatted(value)}}
		>
			<Input.Password placeholder={placeholder} type={type} suffix={suffix} prefix={prefix} addonBefore={addonBefore} addonAfter={addonAfter} size={size} />
		</Form.Item>
		:
		<Form.Item 
     	label={label}
     	name={name}
    	extra={extra}
		  rules={[{ required: true, message: {message} }]}
			style={{width: widthValue}}
			noStyle={props.noStyle}
			normalize={(value, prevValue, prevValues) => { return setFormatted(value)}}
    >
			<Input placeholder={placeholder} type={type} suffix={suffix} prefix={prefix} addonBefore={addonBefore} addonAfter={addonAfter} size={size} disabled={disabled} />
    </Form.Item>
	)
}

export default LimitFormItem;

LimitFormItem.defaultProps = {
	maxValue: null, // 数字输入框最大值
	limit: 10, // 输入框限制长度
	widthValue: '100%', // 输入框长度
	placeholder: '请输入内容',	//提示内容
	type: 'text', //文本框类型
	regType: '', // 正则类型
	pattern:null,
	message: '请正确输入', // antd rule校验规则,提示
	noStyle: false
}
