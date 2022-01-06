import React, { useState, useEffect } from 'react';
import { Input } from 'antd';

const LimitInput = (props) => {
	const {widthValue, value, maxValue, limit,regType,placeholder,type,suffix,prefix,addonAfter,addonBefore,size,className, isRest} = props;
	const [content, setContent] = useState(value);	
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
			return /[\s\u4E00-\u9FA5]|[\s\uFE30-\uFFA0]/g
		},
		'money': () => {
			return /[^\d./]+/ig
		}
	};
	  
	const setFormattedContent = text => {
		/**
		 * cosm
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
			text = text.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只出现一个 .
			text = text.replace(".","$#$").replace(/\./g,"").replace("$#$",".") // 只出现一个 .
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
		text.length > limit ? setContent(text.slice(0, limit)) :setContent(text);
		// text.length > limit ? props.getValue(Number(text.slice(0, limit))) :props.getValue(Number(text));
	};

  useEffect(() => {
		setFormattedContent(content);
		if (isRest) {
			setRest()
		}
		// 返回值
		props.getValue(content)
  }, [content, isRest]);

  const setRest = () => {
		console.log('重置')
		setContent('')
	}
	
	return (
		regType === 'pwd'
		?
		<Input.Password className={className} style={{width: widthValue}} value={content}  onChange={event => setFormattedContent(event.target.value)} placeholder={placeholder} type={type} suffix={suffix} prefix={prefix} addonBefore={addonBefore} addonAfter={addonAfter} size={size} allowClear/>
		:
		<Input className={className} style={{width: widthValue}} value={content}  onChange={event => setFormattedContent(event.target.value)} placeholder={placeholder} type={type} suffix={suffix} prefix={prefix} addonBefore={addonBefore} addonAfter={addonAfter} size={size} allowClear/>
	)
}

export default LimitInput ;

LimitInput.defaultProps = {
	value: '', // 初始值
	maxValue: null, // 数字输入框最大值
	limit: 10, // 输入框限制长度
	widthValue: '100%', // 输入框长度
	placeholder: '请输入内容',	//提示内容
	type: 'text', //文本框类型
	regType: '', // 正则类型
	isRest: false // 是否重置
}
 