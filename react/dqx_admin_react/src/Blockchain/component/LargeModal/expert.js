import React from 'react';
import { Table, Row, Col  } from 'antd'

class Expert extends React.Component{
    state = {
        data: []
    }
    render() {
        const columns = [
            {
              title: '购买时间',
              align: 'center',
              dataIndex: 'name'
            },
            {
              title: '购买用户',
              align: 'center',
              dataIndex: 'adCount'
            },
            {
                title: '购买金额',
                align: 'center',
                dataIndex: 'adCount'
              }
        ]
        return(
            <div style={{width:'50vw'}}>
                <Row justify="space-between">
                    <Col>方案购买情况 人数：999</Col>
                    <Col>总收益：￥9999.99</Col>
                </Row>
                <Table columns={columns} dataSource={this.state.data} onChange={this.handleChange} rowKey="id"/>
            </div>
        )
    }
}
export default Expert