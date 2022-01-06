import React from 'react';
import { Table, Tabs } from 'antd';

import Book from './book';
const { TabPane } = Tabs;

class Reservation extends React.Component {

	 constructor(props) {
		 super(props)
		 this.bballRef = React.createRef();
		 this.fballRef = React.createRef();
	 }

	 // tab交换
	callback = (key) => {
		console.log(key)
		if (key === "1") {
			this.bballRef.current.getData()
    }
    if (key === "0") {
			if (this.fballRef.current) {
				this.fballRef.current.getData()
			}
    }
	}

	// 获取选中值
	selectedValue = (obj) => {
		this.props.selectedValue(obj)
	}
    render () {
        return (
            <div>
							 <Tabs defaultActiveKey="1" onChange={this.callback}>
									<TabPane tab="篮球" key="1">
										<Book ref = {this.bballRef} category={1} top={this.props.top} selectedValue={this.selectedValue}/>
									</TabPane>
									<TabPane tab="足球" key="0">
										<Book ref = {this.fballRef} category={0} top={this.props.top} selectedValue={this.selectedValue}/>
									</TabPane>
								</Tabs>
            </div>
        )
    }
}

export default Reservation;

Reservation.defaultProps = {
	top: false
}