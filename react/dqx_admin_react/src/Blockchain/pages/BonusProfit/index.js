import React from 'react';
import moment from 'moment';
import { Row, Col, Input, Button, Select, Table, Modal } from 'antd'
import BonusModal from '../../component/LargeModal/bonus';

import { getAwardsList, getAwardsCount, getAwardsDetails } from '../../api/wallets'

const { Option } = Select;

class BonusProfit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      states: '1',
      searchlogs: '',
      visible: false,
      data: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      awardStatus: {},
      detailValue: {}
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
  async handleSearch(e) {
    this.getList()
   }

  /**
   * 状态筛选
   * @param {*} e 
   */
  async changeState(e) { }

  /**
   * 弹出窗
   * @param {*} e 
   */
  async searchDetail(e) {
    this.awardDetail(e)
   }

  /**
   * 表格信息变化
   */
  handleChange() { }

  /**
   * 得到列表
   */
  getList() {
    let params = {
      page: this.state.pageIndex,
      page_size: this.state.pageSize
    }
    if (this.state.searchlogs) {
      Object.assign(params, {mobile: this.state.searchlogs})
    }
    getAwardsList(params).then(res => {
      this.setState({
        data: res.data,
        pageIndex: res.meta.pagination.currentPage,
        pageSize: res.meta.pagination.perPage,
        total: res.meta.pagination.total
      })
    })
  }

  /**
   * 得到奖励金统计
   */
  awardsCount() {
    getAwardsCount().then(res => {
      this.setState({
        awardStatus: res.data
      })
    })
  }

  /**
   * 获取奖励金详情
   */
  awardDetail(award) {
    getAwardsDetails(award).then(res => {
      console.log(res.data)
      this.setState({
        detailValue: res.data,
        visible: true
      })
    })
  }

  /**
   * 刷新数据
   */
  handleRestData = () => {
    this.getList()
  }

  componentDidMount() {
    this.awardsCount()
    this.getList()
  }


  render() {
    //搜索框切换搜索内容
    const selectBefore = (
      <Select defaultValue="1" className="select-before">
        <Option value="1">手机号</Option>
      </Select>
    );
    //表格列
    const columns = [
      {
        title: '专家昵称',
        align: 'center',
        render: (text, item, index) => (
          <span>{item.wallet.nickname}</span>
      ),
      },
      {
        key: 'publishTime',
        title: '收益日期',
        align: 'center',
        render: (text, item, index) => (
            <span>{moment(item.publishTime).format('YYYY-MM-DD HH:mm:ss')}</span>
        ),
        sorter: (a, b) => a.publishTime - b.publishTime
      },
      {
        key: 'amount',
        title: '订单金额',
        align: 'center',
        dataIndex: 'amount',
        sorter: (a, b) => a.amount - b.amount
      },
      {
        // key: 'groupName',
        title: '收益类型',
        align: 'center',
        render: (text, record, index) => (
          <span>
            奖励金
          </span>
        )
      },
      {
        key: 'action',
        title: '操作',
        width: 250,
        align: 'center',
        render: (text, item, index) => (
          <span>
            <Button type="link" onClick={() => this.searchDetail(item.id)}>查看详情</Button>
          </span>
        )
      }
    ];
    return (
      <div>
        <Row className="header-count top-stats" justify="start">
          <Col span={5}>
            <em>今日奖励金支出：<i>{this.state.awardStatus.todayCount}笔</i></em>
            <span>¥{this.state.awardStatus.todayAmount}</span>
          </Col>
          <Col span={5} style={{marginLeft: 20}}>
            <em>总奖励金支出：<i>{this.state.awardStatus.totalCount}笔</i></em>
            <span>¥{this.state.awardStatus.totalAmount}</span>
          </Col>
        </Row>
        <div className="content-padding ant-right">
          <Input className="antd-mr" addonBefore={selectBefore} placeholder="请输入" style={{ width: 300 }} value={this.state.searchlogs} onChange={this.handleSearchInput.bind(this)} onPressEnter={this.handleSearch.bind(this)} maxLength={30} allowClear />
          <Button className="antd-mr" type="primary" onClick={this.handleSearch.bind(this)}>查询</Button>
          {/* <Button className="antd-mr" type="default" onClick={this.handleRest}>重置</Button> */}
          <Button className="antd-mr" type="primary" onClick={this.handleRestData}>刷新数据</Button>
        </div>
        <div className="content">
          <Table columns={columns} dataSource={this.state.data} onChange={this.handleChange} rowKey="id" pagination={false} />
        </div>
        <Modal
          title="这是一个动态标题"
          visible={this.state.visible}
          className="large-modal"
          footer={null}
          onCancel={() => this.setState({visible: false})}
        >
          < BonusModal data={this.state.detailValue} />
        </Modal>
      </div>
    )
  }
}


export default BonusProfit;
