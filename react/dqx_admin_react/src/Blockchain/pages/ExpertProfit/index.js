import React from 'react';
import { Row, Col, Input, Button, Select, Table, Modal } from 'antd'
import ExpertModal from '../../component/LargeModal/expert'

const { Option } = Select;

class ExpertProfit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      states: '1',
      searchlogs: '',
      visible: false,
      data: [{ name: '2',id: 1 }]

    }
  }


  /**
   * 输入框的onchange事件
   * @param {*} e -输入框对象
   */
  async handleSearchInput(e) {
    this.setState({
      searchlogs: e.target.value
    })
  }

  /**
   * 查询事件/点击搜索、回车
   * @param {*} e 
   */
  async handleSearch(e) { }

  /**
   * 状态筛选
   * @param {*} e 
   */
  async changeState(e) { }

  /**
   * 提审详情
   * @param {*} e 
   */
  async searchDetail(e) {
    this.setState({
      visible: true
    })
   }

  /**
   * 表格信息变化
   */
  handleChange() { }

  render() {
    //搜索框切换搜索内容
    const selectBefore = (
      <Select defaultValue="1" className="select-before">
        <Option value="1">订单号</Option>
        <Option value="2">专家昵称</Option>
      </Select>
    );
    //表格列
    const columns = [
      {
        title: '订单号',
        align: 'center',
        render: (text, item, index) => (
          <span>{item.name}</span>
        )
      },
      {
        title: '专家昵称',
        align: 'center',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        align: 'center',
        dataIndex: 'name'
      },
      {
        title: '订单金额',
        align: 'center',
        render: (text, item, index) => (
          <span>{item.name}</span>
        )
      },
      {
        key: 'action',
        title: '操作',
        width: 250,
        align: 'center',
        render: (text, item, index) => (
          <span>
            <Button type="link" onClick={() => this.searchDetail()}>提现详情</Button>
          </span>
        )
      }
    ];
    return (
      <div>
        <Row className="header-count">
          <Col>
            今日专家收益：
          </Col>
          <Col>
            总收益：
          </Col>
        </Row>
        <div className="content-padding ant-right">
          <Input className="antd-mr" addonBefore={selectBefore} placeholder="请输入" style={{ width: 300 }} value={this.state.searchlogs} onChange={this.handleSearchInput.bind(this)} onPressEnter={this.handleSearch.bind(this)} maxLength={30} />
          <Button className="antd-mr" type="primary" onClick={this.handleSearch.bind(this)}>查询</Button><Button className="antd-mr" type="default" onClick={this.handleRest}>重置</Button>
          <Button className="antd-mr" type="primary" onClick={this.handleRest}>刷新数据</Button>
        </div>
        <div className="content">
          <Table columns={columns} dataSource={this.state.data} onChange={this.handleChange} rowKey="id" pagination={false} />
        </div>
        <Modal
          title="这是一个动态标题"
          visible={this.state.visible}
          className="large-modal"
          footer={null}
        >
          < ExpertModal />
        </Modal>
      </div>
    )
  }
}


export default ExpertProfit;
