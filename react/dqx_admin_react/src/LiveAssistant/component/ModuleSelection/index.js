import React from 'react';
import { Select, Button } from 'antd';
import { getAdModule } from '@api/createAd.js';

const { Option } = Select;

class ModuleSelection extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			etGroup: [],
			etCurren: 1,
			emissionModal: [],
			emissionPage: [],
			emissionModalCurrent: undefined,
			emissionPageCurrent: undefined
		}
	}

		/**
	 * 选择体育
	 * @param {string} current 
	 */
	handleEt = (current) => {
		const arr = this.getChildrenArr(current, this.state.etGroup)
		this.setState({
			etCurren: current,
			emissionModalCurrent: arr[0] ? arr[0].id : undefined,
			emissionModal: arr,
		})
		const secondArr = this.getChildrenArr(arr[0] ? arr[0].id : undefined, arr)
		this.setState({
			emissionPage: secondArr,
			emissionPageCurrent: secondArr[0] ? secondArr[0].id : undefined,
		})
		this.props.pageId(secondArr[0] ? secondArr[0].id : undefined)
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
			emissionPage: arr
		})
		this.props.pageId(arr[0] ? arr[0].id : undefined)
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
			emissionPageName: name
		})
		this.props.pageId(current)
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
	 * 获取模块
	 */
	async getAdModules() {
		const res = await getAdModule();
		this.setState({
			etGroup: res.data
		})
		const arr = this.getChildrenArr(1, this.state.etGroup)
		const secondArr = this.getChildrenArr(arr[0] ? arr[0].id: undefined, arr)
		this.setState({
			emissionModal: arr,
			emissionModalCurrent: undefined
		})
		if (this.props.initValue) {
			this.setState({
				emissionModal: arr,
				emissionModalCurrent: arr[0] ? arr[0].id : undefined,
				emissionPage: secondArr,
				emissionPageCurrent: secondArr[0] ? secondArr[0].id : undefined,
			}, () => {
				this.props.pageId(this.state.emissionPageCurrent)
			})
		}
	}

	restId = () => {
		this.setState({
			etCurren: 1,
			emissionModalCurrent: null,
			emissionPageCurrent: null
		}, () => {
			this.props.pageId(this.state.emissionPageCurrent)
		})
	}

	componentDidMount() {
		this.getAdModules();
	}

 render() {
	return (
    <div className="modules-selection">
			<label>投放体育模块：</label>
			<Select className="antd-mr antd-ml8" style= {{width: 200}} defaultValue={1} value={this.state.etCurren} onChange={this.handleEt}>
				{
					this.state.etGroup.map((item, index) => {
						return <Option key={index} value={item.id}>{item.name}</Option>
					})
				}
			</Select>
			<label>投放模块：</label>
			<Select allowClear={!this.props.initValue} className="antd-mr antd-ml8" style= {{width: 200}} placeholder="请选择" value={this.state.emissionModalCurrent} onChange={this.handleEmissionModal}>
				{
					this.state.emissionModal.map((item, index) => {
						return <Option key={index} value={item.id}>{item.name}</Option>
					})
				}
			</Select>
			<label>投放页面：</label>
			<Select className="antd-mr antd-ml8" style= {{width: 200}} placeholder="请选择" value={this.state.emissionPageCurrent} onChange={this.handleEmissionPage}>
				{
					this.state.emissionPage.map((item, index) => {
						return <Option key={index} value={item.id}>{item.name}</Option>
					})
				}
			</Select>
			{
				!this.props.initValue
				?
				<Button className="antd-mr" onClick={this.restId}>重置</Button>
				:
				null
			}
		</div>
  )
 }
}

export default ModuleSelection;
