import React from 'react';
import { Form, Input, Button, Select, Row, Col, message } from 'antd';

import { professioTypes } from '../../api/user';

import UploadImage from '../../../component/UploadImage';
import LimitFormItem from '../../../component/LimitFormItem';

import idfont from '../../img/idfont.png';
import idband from '../../img/idband.png';
import idhand from '../../img/idhand.png';
import job from '../../img/job.png';

import { apply } from '../../api/user';

const { Option } = Select;
const { TextArea } = Input;

const tailLayout = {
	wrapperCol: {
		offset: 10,
		span: 16,
	},
};

// const jobArr = [
// 	{
// 		name: '教练',
// 		value: 1
// 	},
// 	{
// 		name: '退役球员',
// 		value: 2
// 	},
// 	{
// 		name: '解说员',
// 		value: 3
// 	},
// 	{
// 		name: '无',
// 		value: 0
// 	}
// ]

class RealName extends React.Component {
	constructor(props) {
		super(props)
		// 绑定新增表单
		this.formRef = React.createRef();
		this.state = {
			professionType: null,
			recentMatch: '',
			reason: '',
			example: `04月23日 英超 曼城VS切尔西
				盼望着，盼望着，东风来了，春天的脚步近了。一切都像刚睡醒的样子，欣欣然张开了眼。山朗润起来了，水涨起来了，太阳的脸红起来了。小草偷偷地从土地里钻出来，嫩嫩的，绿绿的。园子里，田野里，瞧去，一大片一大片满是的。坐着，躺着，打两个滚，踢几脚球，赛几趟跑，捉几回迷藏。风轻悄悄的，草软绵绵的。桃树，杏树，梨树，你不让我，我不让你，都开满了花赶`,
			realName: '',
			idNumber: '',
			idCardFront: null,
			idCardBack: null,
			idCardHand: null,
			professionImage: null,
			jobArr: [],
			reasonNum: 0
		}
	}

	/**
	* 
	* @param {*} e -状态选中值
	*/
	changeState = e => {
		this.setState({
			professionType: e
		});
	}

	/**
	 * 
	 * @param {*} e 近期比赛
	 */
	handleChangeGame = e => {
		this.setState({
			recentMatch: e.target.value
		})
	}

	/**
	 * 
	 * @param {*} e 推荐理由
	 */
	handleChangeReason = e => {
		this.setState({
			reasonNum: e.target.value.length
		})
	}

	/**
	 * 例子
	 * @param {*} e 
	 */
	handleChangeExample = e => {
		this.setState({
			example: e.target.value
		})
	}

	/**
	 * 
	 * @param {*} e 姓名
	 */
	handleChangeName = e => {
		this.setState({
			realName: e.target.value
		})
	}

	/**
	 * 
	 * @param {*} e 身份证
	 */
	handleChangeIDCard = e => {
		this.setState({
			idNumber: e.target.value
		})
	}

	/**
	 * 上传身份证正面
	 */
	handleIDPositive = url => {
		this.setState({
			idCardFront: url
		})
	}

	/**
	 * 上传背面身份证照
	 */
	handleIDBack = url => {
		this.setState({
			idCardBack: url
		})
	}

	/**
	 * s
	 */
	handleIDHand = url => {
		this.setState({
			idCardHand: url
		})
	}

	/**
	 * 上传职业照
	 */
	handleJob = url => {
		this.setState({
			professionImage: url
		})
	}

	/**
	 * 专家职业类型
	 */
	async professioTypeArr() {
		const res = await professioTypes()
		this.setState({
			jobArr: res.data
		})
	}

	componentDidMount() {
		this.professioTypeArr()
	}


  /**
   * 校验失败的回调
   */
	handleError = () => {
		message.error('有必填内容未填写!');
	}

	/**
	* 提交审核
	*/
	handleOk = () => {
		const realMes = this.formRef.current.getFieldsValue()
		if (this.state.professionType !== 0 && !this.state.professionImage) {
			message.error('请上传职业照！')
			return
		}
		if (!this.state.idCardFront) {
			message.error('请上传身份证正面照！')
			return
		}
		if (!this.state.idCardBack) {
			message.error('请上传身份证背面照！')
			return
		}
		if (!this.state.idCardHand) {
			message.error('请上传手持身份证照！')
			return
		}
		const params = {
			...realMes,
			idCardFront: this.state.idCardFront,
			idCardBack: this.state.idCardBack,
			idCardHand: this.state.idCardHand,
			example: this.state.example
		}
		if (this.state.professionType !== 0) {
			Object.assign(params, {
				professionImage: this.state.professionImage
			})
		}
		this.props.getValue(params)
	}

	returnPre = () => {
		this.props.current()
	}


	render() {
		return (
			<div className="real-name">
				<h2 className="registered-title">实名认证</h2>
				<Form
					ref={this.formRef}
					name="real-name"
					onFinish={this.handleOk}
					onFinishFailed={this.handleError}
				>
					<Row justify="center">
						<Col span={12}>
							{/* <div className="item">
								<label>姓名：</label>
								<Input value={this.state.realName} onChange = {this.handleChangeName} />
							</div> */}
							<Form.Item
								label="姓名"
								name="realName"
								rules={[{ required: true, message: '姓名不能为空!' }]}
							>
								<Input placeholder="请输入" maxLength={30} />
							</Form.Item>
							{/* <div className="item">
								<label>职业类别：</label>
								<Select value={this.state.professionType} onChange={this.changeState}>
									{
										this.state.jobArr.map((item, index) => {
										return <Option key={index} value={item.value}>{item.display}</Option>
										})
									}
								</Select>
							</div> */}
							<Form.Item
								label="职业类别"
								name="professionType"
								rules={[{ required: true, message: '请选择职业类别!' }]}
							>
								<Select onChange={this.changeState}>
									{
										this.state.jobArr.map((item, index) => {
											return <Option key={index} value={item.value}>{item.display}</Option>
										})
									}
								</Select>
							</Form.Item>
							{
								this.state.professionType == null || this.state.professionType === 0
									?
									null
									:
									<div className="cards" style={{marginBottom: 32}}>
										<span className="extar-idcrads">（照片清晰无遮挡）</span>
										<UploadImage styles={{ width: 250, height: 158 }} url="https://dev.jinqiulive.com/front-tools/oss/token?type=video" cover={job} getImgUrl={this.handleJob} isShowLoading={false} />
									</div>
							}
							{/* <div className="item">
								<label>身份证号码：</label>
								<Input value={this.state.idNumber} onChange = {this.handleChangeIDCard}  />
								{this.state.idNumber.length === 0 || this.state.idNumber.length === 15 || this.state.idNumber.length === 18 ? null :<p style={{color: '#ff4d4f', fontSize: 14}}>请输入正确的身份证信息</p>}
							</div> */}
							{/* <Form.Item 
							className="antd-mt"
              label="身份证号码"
              name="idNumber"
              rules={[{ required: true, pattern: new RegExp(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, 'g') ,message: '请输入正确的身份证信息!' }]}
              >
                <Input placeholder="请输入身份证号码" maxLength={18}/>
            	</Form.Item> */}
							<LimitFormItem
								label="身份证号码"
								name="idNumber"
								regType="id"
								limit={18}
								message="请输入正确的身份证号码"
							/>
							<div className="item IDCards">
								<p>身份证信息：<span className="extar-idcrads">（照片清晰无遮挡）</span></p>
								<div className="cards">
									<UploadImage styles={{ width: 250, height: 158 }} url="https://dev.jinqiulive.com/front-tools/oss/token?type=video" cover={idfont} getImgUrl={this.handleIDPositive} isShowLoading={false} />
									<span className="extar-idcrads">请上传身份证正面照片</span>
								</div>
								<div className="cards">
									<UploadImage styles={{ width: 250, height: 158 }} url="https://dev.jinqiulive.com/front-tools/oss/token?type=video" cover={idband} getImgUrl={this.handleIDBack} isShowLoading={false} />
									<span className="extar-idcrads">请上传身份证反面照片</span>
								</div>
								<div className="cards">
									<UploadImage styles={{ width: 250, height: 158 }} url="https://dev.jinqiulive.com/front-tools/oss/token?type=video" cover={idhand} getImgUrl={this.handleIDHand} isShowLoading={false} />
									<span className="extar-idcrads">请上传手持身份证正面照片</span>
								</div>
							</div>
							<div className="item extra">
								<p>备注</p>
								<p><i>*</i>审核通过后，工作人员将在3个工作日内联系您</p>
								<p><i>*</i>本活动最终解释权归今球所有</p>
							</div>
						</Col>
						<Col span={12} push={3}>
							{/* <Input style={{width: 400}} value={this.state.recentMatch} onChange = {this.handleChangeGame} />
							{this.state.recentMatch.length === 0 ? <p style={{color: '#ff4d4f', fontSize: 14}}><i>*</i>近期比赛不能为空</p>:null} */}
							<Form.Item
								label="近期比赛"
								name="recentMatch"
								extra="（请填写最近分析的一场比赛名称）"
								rules={[{ required: true, message: '近期比赛不能为空!' }]}
							>
								<Input placeholder="请输入" maxLength={50} />
							</Form.Item>
							{/* <p className="extar-idcrads">（请填写最近分析的一场比赛名称）</p> */}
							<Form.Item
								label="推荐理由"
								name="reason"
								rules={[{ required: true, min: 100, message: '推荐理由不少于100字!' }]}
								extra={<div><span>推荐理由（条理清晰，不少于100字）</span><span>已输入{this.state.reasonNum}字</span></div>}
							>
								<TextArea placeholder="请输入" rows={4} onChange={this.handleChangeReason} />
							</Form.Item>
							{/* <TextArea style={{width: 400}} rows={8} value={this.state.reason} onChange = {this.handleChangeReason} /> */}
							{/* <span className="antd-ml8">当前字数是{this.state.reason.length}</span>
								<p className="extar-idcrads">推荐理由（条理清晰，不少于300字）</p> */}
							<div style={{ display: 'flex' }}>
								<label>示例：</label>
								<TextArea disabled style={{ width: 400 }} rows={8} value={this.state.example} onChange={this.handleChangeExample} />
							</div>
						</Col>
						<Col span={24} style={{ textAlign: "center" }}>
							<Form.Item className="steps-action" colon={false}>
								<Button size="large" type="primary" htmlType="submit">
									提交审核
              </Button>
								{/* <Button size="large" style={{ margin: 8 }} onClick={() => this.returnPre()}>
									上一步
              </Button> */}
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</div>
		)
	}
}

export default RealName;
