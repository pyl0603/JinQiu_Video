import React from 'react';
import { DollarOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import './style.scss';

class DragCard extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			current: false,
			id: null,
			currentValue: {},
			changeId: null,
			changeValue: {},
			data: this.props.data
		}
	}

	/**
	 * 下架功能
	 */
	handleDown = (data) => {
		if (this.props.down) {
			this.props.getDown(data)
		}
	}

	/**
	 * 还原
	 */
	handleReduction = (data) => {
		if (this.props.reduction) {
			this.props.getReduction(data)
		}
	}

	/**
	 * 删除功能
	 */
	handleDele = (data) => {
		if(this.props.dele) {
			this.props.getDele(data)
		}
	}

	/**
	 * 上架功能
	 */
	handleUp = (data) => {
		if (this.props.up) {
			this.props.getUp(data)
		}
	}

	/**
	 * 拖拽开始
	 */
	handleDragStart= (e) => {
		this.setState({
			current: true,
			id: e.currentTarget.dataset.id,
			currentValue: e.currentTarget.dataset.item
		})
	}

	/**
	 * 拖拽放下
	 */
	handleDragEnd = (e) => {
		let data = this.state.data;
    let from = Number(this.state.id);
		let to = Number(this.state.changeId);
		const currentValues = JSON.parse(this.state.currentValue);
		const id = currentValues['id'];
		// data[from]=[data[to], data[to]=data[from]][0]
		data.splice(to, 0, data.splice(from, 1)[0]);
		this.setState({
			data: data,
			current: false
		});
		if (this.props.drage && this.props.getMove) {
			this.props.getMove(id, to, from);
		}
	}

	handleDragEnter = (e) => {
		e.preventDefault();
		if (e.target.tagName !== "LI") {
      return;
		}

		console.log(this.state.id)
	}

	/**
	 * drap
	 */
	handleDrop = (e) => {
		e.preventDefault();
		this.setState({
			changeId: e.currentTarget.dataset.id,
			changeValue: e.currentTarget.dataset.item
		})
	}

	/**
	 * 查看详细的功能
	 */
	handleDetails = (data) => {
		if (this.props.getDetail) {
			this.props.getDetail(data)
		}
	}

	componentDidMount () {
		this.setState({
			data: this.props.data
		})
	}

	/**
	 * 传入的props不一样则改变
	 * @param {*} nextProps 
	 * @param {*} prevState 
	 */
	static getDerivedStateFromProps(nextProps, prevState) {
		if (prevState.data !== nextProps.data) {
			return {
				data: nextProps.data
			}
		}
		return null
  }
	
  render () {
		let items = this.state.data.map((item, index) => {
			return (
				<li
				className={'drag-card' + (this.state.id && Number(this.state.id )  === index && this.state.current ?' drag-card-active':'') }
				draggable={this.props.drage}
				onDragStart={(e) => this.handleDragStart(e)}
				onDragEnd={(e) => this.handleDragEnd(e)}
				onDrop={(e) => this.handleDrop(e)}
				key={index}
				data-id = {index}
				data-item={JSON.stringify(item)}
				>
					<div className={`drag-header${this.props.getDetail ? ' antd-cp' : ''}`} onClick={() => this.handleDetails(item)}>
						{/* {
							this.props.drage
							?
							<span
							className="antd-cp"
							>...</span>
							:
							null
						} */}
						<i className="drag-icon">
							<img src={item.icon} alt=" " />
						</i>
						<div className="drag-header-title">
							<span className="money">{item.title}今币</span>
							<span className="nums">剩余库存：--</span>
						</div>
						{this.props.tag ? <div className="drag-tag"><i className={"drag-header-tag" +(item.isTimeLimited ? ' tag-isTimeLimite':'')}></i><span>{item.isTimeLimited ? '限时': '上架'}</span></div>:null}
					</div>
					<div className="drag-content">
						<p className="drag-content-desc">{item.display}</p>
						<div style={{marginBottom: '24px'}}>虚拟币价值：<span style={{float: "right"}}>{item.amount}个</span></div>
						<div>人民币价值：<span style={{float: "right"}}>{item.price / 100}元</span></div>
					</div>
					<div className="drag-footer">
						{
							this.props.down ?
							<a className="down-button" onClick={() => this.handleDown(item)}>下架</a>
							:
							null
						}
						{
							this.props.up ?
							<a className="up-button" onClick={() => this.handleUp(item)}>上架</a>
							:
							null
						}
						{
							this.props.dele ?
							<a className="dele-button" onClick={() => this.handleDele(item)}>删除</a>
							:
							null
						}
						{
							this.props.reduction ?
							<a className="reduction-button" onClick={() => this.handleReduction(item)}>还原</a>
							:
							null
						}
					</div>
				</li>
			)
		})
    return (
			<ul	
			onDragOver={(e) => this.handleDragEnter(e)}
			className="drag-list">{items}</ul>
    )
  }
}

export default DragCard;

DragCard.defaultProps = {
	drage: true,
	up: false,
	down: true,
	dele: false,
	reduction: false,
	data: [],
	tag: false
}
