import React from 'react';
import { Table, DatePicker, Row, Button, Select } from 'antd'
import moment from 'moment'

const { Option } = Select;

class GetComp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      matchTime: Date.parse(new Date()),
      searchType: ''
    }
  }


  /**
   * 类型选择回调
   * @param {*} e 
   */
  searTypeChange = (e) => {
    this.setState({
      searchType: e
    })
    this.props.compType(e)
  }

  /**
   * 赛事选择回调
   */
  async chooseItem(e) {
    this.props.chooseItem(e)
  }

  /**
   * 时间选择回调
   * @param {*} e 
   */
  changeTime = (date, dateString) => {
    this.props.changeTime(new Date(date._d).getTime())
  }


  render() {
    const columns = [
      {
        title: '比赛时间',
        dataIndex: 'match_time',
        render: (text, item, index) => (
          <span>
            <span>{moment(item.match_time).format('YYYY-MM-DD HH:mm:ss')}</span>
          </span>
        )
      },
      {
        title: '联赛',
        dataIndex: 'competitionName'
      },
      {
        title: '赛事名称',
        render: (text, item, index) => (
          <span>
            {item.homeTeamName}VS{item.awayTeamName}
          </span>
        )
      },
      {
        key: 'action',
        title: '操作',
        align: 'center',
        render: (text, item, index) => (
          <span>
            <Button type="link" onClick={this.chooseItem.bind(this, item)}>选择</Button>
          </span>
        )
      }
    ]
    return (
      <div>
        <Row justify="end">
          {
            this.props.category == 1 ? (
              <Select value={this.state.searchType} onChange={this.searTypeChange} style={{ width: '150px', marginRight: '10px' }}>
                <Option value="">全部</Option>
                <Option value={1}>NBA</Option>
                <Option value={3}>CBA</Option>
                <Option value={237}>男篮世界杯</Option>
              </Select>
            ) :
              <Select value={this.state.searchType} onChange={this.searTypeChange} style={{ width: '150px', marginRight: '10px' }}>
                <Option value="">全部</Option>
                <Option value={82}>英超</Option>
                <Option value={120}>西甲</Option>
                <Option value={129}>德甲</Option>
                <Option value={108}>意甲</Option>
                <Option value={142}>法甲</Option>
                <Option value={542}>中超</Option>
                <Option value={491}>亚冠</Option>
                <Option value={46}>欧冠</Option>
              </Select>
          }

          <DatePicker onChange={this.changeTime} format="YYYY-MM-DD HH:mm:ss"></DatePicker>
        </Row>
        <Table columns={columns} className="antd-mt" dataSource={this.props.compData} rowKey="id" pagination={false} scroll={{ y: 'calc(80vh - 200px)' }}></Table>
      </div>
    )
  }
}

export default GetComp