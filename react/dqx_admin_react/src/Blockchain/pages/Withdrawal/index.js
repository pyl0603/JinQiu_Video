import React from 'react';
import moment from 'moment';
import { Row, Col, Input, Button, Select, Table, Modal } from 'antd'
import DetModal from '../../component/LargeModal'
import { getFundOrder, getOrderStats } from '../../api/order'
import './withdrawal.scss'

import LimitInput from '../../../component/LimitInput';

const { Option } = Select;

class Withdrawal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      states: '',
      searchlogs: '',
      searchType: '1',
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      data: [],
      visible: false,
      itemData: '',
      ModalTitle: '',
      nickname: '',
      isRest: false,
      orderStats: {
        fundSuccess: { count: '', amount: '', rmb: '' },
        waitVerify: { count: '', amount: '', rmb: '' },
        waitFund: { count: '', amount: '', rmb: '' },
        total: { count: '', amount: '', rmb: '' },
        today: { count: '', amount: '', rmb: '' }
      }
    }
  }

  /**
   * 挂载
   */
  async componentWillMount() {
    let res = await getOrderStats({ type: this.props.states ? 4 : 3 })
    this.setState({
      states: this.props.states ? 100 : '',
      orderStats: res.data
    }, () => {
      this.getList()
    })

  }

  /**
   * 获取提现列表
   */
  async getList() {
    let data = {
      page: this.state.pageIndex,
      type: this.props.type,
      num: this.state.searchType === '1' ? this.state.searchlogs : '',
      mobile: this.state.searchType === '1' ? '' : this.state.searchlogs,
      status: this.state.states
    }
    getFundOrder(data).then(res => {
      this.setState({
        data: res.data,
        pageIndex: res.meta.pagination.currentPage,
        pageSize: res.meta.pagination.perPage,
        total: res.meta.pagination.total
      })
    })
  }

  /**
   * 获取订单情况
   * @param {*} e 
   */
  async orderStats() {
    let data = {
      type: this.props.states ? 4 : 3
    }
    getOrderStats(data).then(res => {
      this.setState({
        orderStats: res.data
      })
    })
    console.log()
  }

  /**
   * 输入框的onchange事件
   * @param {*} e -输入框对象
   */
  async handleSearchInput(e) {
    this.setState({
      isRest: false,
      searchlogs: e
    })
  }

  /**
 * 搜索
 */
  handleSearch = () => {
    this.setState({
      pageIndex: 1
    }, () => {
      this.getList()
    })

  }

  /**
   * 状态筛选
   * @param {*} e 
   */
  async changeState(e) {
    this.setState({
      states: e,
      pageIndex: 1
    }, () => {
      this.getList()
    })
  }

  /**
   * 提审详情
   * @param {*} e 
   */
  async searchDetail(e) {
    this.setState({
      visible: true,
      itemData: e,
      ModalTitle: e.buyer.realName,
      nickname: e.buyer.nickname
    })
  }


  /**
   * 搜索类型
   */

  searTypeChange = (e) => {
    this.setState({
      searchType: e,
      searchlogs: ''
    })
  }
  /**
   * 关闭弹窗
   */
  closeModal = () => {
    this.setState({
      visible: false
    })
  }

  /**
   * 订单操作
   */
  refresh = () => {
    this.setState({
      visible: false
    }, () => {
      this.getList()
    })

  }

  /**
* 翻页
* @param {*} page 
*/
  changePage = (page) => {
    this.setState({
      pageIndex: page
    }, () => {
      this.getList()
    })
  }

	/**
   * 改变每页显示条目数
   */
  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
    this.setState({
      pageIndex: current,
      pageSize: pageSize
    }, () => {
      this.getList()
    })
  }

  /**
   * 提示表格共有多少条
   * @param {*} total 
   * @param {*} range 
   */
  showTotal = (total, range) => {
    return `共有${total}条数据，当前每页最多显示${this.state.pageSize}条`
  }

  /**
   * 重置
   */
  handleRest = () => {
    console.log(this.state.searchlogs)
    this.setState({
      isRest: true
    })
  }

  render() {
    //搜索框切换搜索内容
    const selectBefore = (
      <Select value={this.state.searchType} onChange={this.searTypeChange} className="select-before">
        <Option value="1">提现单号</Option>
        <Option value="2">手机号</Option>
      </Select>
    );
    //表格列
    const columns = [
      {
        title: '提审时间',
        align: 'center',
        dataIndex: 'createdAt',
        render: (text, item, index) => (
          <span>{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
        ),
        sorter: (a, b) => a.createdAt - b.createdAt
      },
      {
        title: '提现状态',
        align: 'center',
        render: (text, item, index) => (
          <span>{item.status.display}</span>
        )
      },
      {
        title: '提现单号',
        align: 'center',
        dataIndex: 'id'
      },
      {
        title: '专家昵称',
        align: 'center',
        render: (text, item, index) => (
          <span>{item.buyer.realName || item.buyer.nickname}</span>
        )
      },
      {
        title: '提现金额',
        align: 'center',
        render: (text, item, index) => (
          <span>{item.price / 100}</span>
        ),
        sorter: (a, b) => a.price - b.price
      },
      {
        key: 'action',
        title: '操作',
        width: 250,
        align: 'center',
        render: (text, item, index) => (
          <span>
            <Button type="link" onClick={() => this.searchDetail(item)}>提现详情</Button>
          </span>
        )
      }
    ];
    return (
      <div>
        {
          this.props.states ?
            <Row className="header-count top-stats" justify="space-around">
              <Col span={5}>
                待审金额<br />
                <span>¥{this.state.orderStats.total.rmb}</span>
              </Col>
              <Col span={5}>
                待审笔数<br />
                <span>{this.state.orderStats.total.count}</span>
              </Col>
              <Col span={5}>
                今日待审金额<br />
                <span>¥{this.state.orderStats.today.rmb}</span>
              </Col>
              <Col span={5}>
                今日待审笔数<br />
                <span>{this.state.orderStats.today.count}</span>
              </Col>
            </Row>
            : <Row className="header-count top-stats" justify="space-around">
              <Col span={7}>
                <em>待审核金额：<i>{this.state.orderStats.waitVerify.count}笔</i></em>
                <span>¥{this.state.orderStats.waitVerify.rmb}</span>
              </Col>
              <Col span={7}>
                <em>待审提现金额：<i>{this.state.orderStats.waitFund.count}笔</i></em>
                <span>¥{this.state.orderStats.waitFund.rmb}</span>
              </Col>
              <Col span={7}>
                <em>已提现金额：<i>{this.state.orderStats.fundSuccess.count}笔</i></em>
                <span>¥{this.state.orderStats.fundSuccess.rmb}</span>
              </Col>
            </Row>
        }
        <div className="content-padding">
          <Row className="select-group antd-mb" justify="end">
            {
              this.props.states ? null :
                <Col>
                  选择状态：
                  <Select style={{ width: 120, marginRight: 20 }} onChange={this.changeState.bind(this)} value={this.state.states}>
                    <Option value="">全部状态</Option>
                    <Option value="100">待审核</Option>
                    <Option value="104">待提现</Option>
                    <Option value="1">已提现</Option>
                    <Option value="102">已驳回</Option>
                  </Select>
                </Col>
            }
            <Col>
              {/* <Input className="antd-mr" addonBefore={selectBefore}  placeholder="请输入" style={{ width: 300 }} value={this.state.searchlogs} onChange={this.handleSearchInput.bind(this)} onPressEnter={this.handleSearch.bind(this)} maxLength={30} /> */}
              <LimitInput widthValue={300} className="antd-mr" regType='number' addonBefore={selectBefore} placeholder="请输入" value={this.state.searchlogs} getValue={this.handleSearchInput.bind(this)} limit={this.state.searchType === '1' ? 19 : 11} isRest={this.state.isRest} />
              <Button className="antd-mr" type="primary" onClick={this.handleSearch}>查询</Button><Button className="antd-mr" type="default" onClick={this.handleRest}>重置</Button>
              <Button className="antd-mr" type="primary" onClick={this.getList.bind(this)}>刷新数据</Button>
            </Col>
          </Row>
        </div>
        <div className="content">
          <Table columns={columns} dataSource={this.state.data} rowKey="id"
            pagination={{
              total: this.state.total,
              pageSize: this.state.pageSize,
              current: this.state.pageIndex,
              onChange: this.changePage,
              showTotal: this.showTotal,
              onShowSizeChange: this.onShowSizeChange
            }}
          />
        </div>
        <Modal
          title={`${this.state.ModalTitle ? this.state.ModalTitle : this.state.nickname}|提现详情`}
          visible={this.state.visible}
          className="large-modal"
          footer={null}
          onCancel={this.closeModal}
        >
          <DetModal data={this.state.itemData} refresh={this.refresh} />
        </Modal>
      </div>
    )
  }
}


export default Withdrawal;
