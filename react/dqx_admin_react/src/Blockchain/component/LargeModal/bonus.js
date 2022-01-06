import React from 'react';
import moment from 'moment';
import { Table, Row, Col  } from 'antd';

class Bonus extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			data: props.data
		}
	}
    render() {
        const columns = [
            {
							key: 'createTime',
              title: '创建时间',
							align: 'center',
							render: (text, item, index) => (
								<span>{moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
							),
              dataIndex: 'createTime'
            },
            {
							key: 'amount',
              title: '收益金额',
              align: 'center',
              dataIndex: 'amount'
            }
        ]
        return(
            <div style={{width:'50vw'}}>
                <Table columns={columns} dataSource={[this.state.data]} rowKey="id"/>
								<Row justify="space-between">
                    <Col>专家方案：{this.state.data.planDesc}</Col>
										{/* <Col>方案推荐：</Col> */}
                </Row>
						</div>
        )
    }
}
export default Bonus