import React from 'react';
import moment from 'moment';
import { Input, Select, Table, Button, Row, Col, Modal } from 'antd';
import { getOrder, getOrderStats } from '../../api/order'
import NormalModal from '../NormalModal'

import LimitInput from '../../../component/LimitInput'

const { Option } = Select;

class OrderTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      modalData: '',
      visible: false,
      searchlogs: '',
      status: '',
      searchType: '1',
      nickname: null,
      orderStats: {
        todayBuy: { count: '', amount: '' },
        todayFund: { count: '', amount: '' },
        totalBuy: { count: '', amount: '' },
        totalFund: { count: '', amount: '' },
        today: { count: '', amount: '', rmb: '' },
        todayAndroid: { count: '', amount: '', rmb: '' },
        todayFail: { count: '', amount: '', rmb: '' },
        todayIos: { count: '', amount: '', rmb: '' },
        todayPending: { count: '', amount: '', rmb: '' },
        total: { count: '', amount: '', rmb: '' },
      }
    }

    let typeName = this.props.isOrder ? '订单' : '账单'
    this.columns = [
      {
        key: 'id',
        title: `${typeName}号`,
        align: 'center',
        dataIndex: 'id'
      },
      {
        key: 'title',
        title: `${typeName}状态`,
        align: 'center',
        render: (text, record, index) => (
          <span>
            {record.status.display}
          </span>
        )
      },
      {
        key: 'createdAt',
        title: '创建时间',
        align: 'center',
        render: (text, item, index) => (
          <span>{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
        ),
        sorter: (a, b) => a.createdAt - b.createdAt
      },
      {
        key: 'action',
        title: '操作',
        align: 'center',
        render: (text, record, index) => (
          <span>
            <Button type="link" onClick={this.getModal.bind(this, record)}>查看详情</Button>
          </span>
        )
      }
    ]


    if (this.props.topup) {
      this.columns.splice(3, 0, {
        key: 'enable',
        title: '用户昵称',
        align: 'center',
        render: (text, record, index) => (
          <span>
            {record.buyer.nickname}
          </span>
        )
      },
        {
          key: 'enable',
          title: '支付方式',
          align: 'center',
          render: (text, record, index) => (
            <span>
              {record.payType.display}
            </span>
          )
        },
        {
          key: 'amount',
          title: '充值金额',
          align: 'center',
          render: (text, record, index) => (
            <span>
              {record.amount / 100}
            </span>
          ),
          sorter: (a, b) => a.amount - b.amount
        },
        {
          key: 'coins',
          title: '获得金币',
          align: 'center',
          dataIndex: 'coins',
          sorter: (a, b) => a.coins - b.coins
        })
    }

    if (this.props.buy) {
      this.columns.splice(2, 0, {
        key: 'groupName',
        title: `${typeName}类型`,
        align: 'center',
        render: (text, record, index) => (
          <span>
            {record.type.display}
          </span>
        )
      })

      this.columns.splice(3, 0, {
        key: 'enable',
        title: '用户昵称',
        align: 'center',
        render: (text, record, index) => (
          <span>
            {record.buyer.nickname}
          </span>
        )
      },
        {
          key: 'amount',
          title: `${typeName}金额`,
          align: 'center',
          render: (text, record, index) => (
            <span>
              {record.amount / 100}
            </span>
          ),
          sorter: (a, b) => a.amount - b.amount
        })
    }

    if (this.props.change) {
      this.columns.splice(3, 0, {
        key: 'enable',
        title: '专家昵称',
        align: 'center',
        dataIndex: 'enable'
      },
        {
          key: 'enable',
          title: '转今币',
          align: 'center',
          dataIndex: 'enable'
        },
        {
          key: 'enable',
          title: '转现金',
          align: 'center',
          dataIndex: 'enable'
        })
    }
  }

  async componentDidMount() {
    let res = await getOrderStats({ type: this.props.url.indexOf('case') > -1 ? 2 : 1 })
    this.setState({
      status: this.props.statusList[0].value,
      orderStats: res.data
    }, () => {
      this.getList()
    })
  }

  /**
   * 获取列表
   */
  async getList() {
    let data = {
      page: this.state.pageIndex,
      num: this.state.searchType === '1' ? this.state.searchlogs : '',
      mobile: this.state.searchType === '1' ? '' : this.state.searchlogs,
      status: this.state.status === '-1' ? '' : this.state.status,
      page_size: this.state.pageSize
    }
    getOrder(this.props.url, data).then(res => {
      this.setState({
        data: res.data,
        pageIndex: res.meta.pagination.currentPage,
        pageSize: res.meta.pagination.perPage,
        total: res.meta.pagination.total
      })
    })
  }

  /**
   * 
   * @param {*} e - 单条数据对象
   */
  async getModal(e) {
    this.setState({
      modalData: e,
      visible: true,
      nickname: e.buyer.nickname
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
 * 提示表格共有多少条
 * @param {*} total 
 * @param {*} range 
 */
  showTotal = (total, range) => {
    return `共有${total}条数据，当前每页最多显示${this.state.pageSize}条`
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
   * 输入框
   */
  handleSearchInput = (e) => {
    this.setState({
      searchlogs: e
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
   * 关闭弹窗
   */
  onCancel = () => {
    this.setState({
      visible: false
    })
  }

  /**
 * 
 * @param {object} data - 获取当前行数据
 * @param {number} index - 获取当前行数
 */
  handleDetails = (data, index) => {
    console.log('查看')

  }

  handleChange = (value) => {
    this.setState({
      status: value,
      pageIndex: 1
    }, () => {
      this.getList()
    })
  }


  render() {
    //搜索框切换搜索内容
    const selectBefore = (
      <Select className="select-before" value={this.state.searchType} onChange={this.searTypeChange}>
        <Option value="1">{this.props.isOrder ? '订单号' : '账单号'}</Option>
        <Option value="2">手机号</Option>
      </Select>
    );
    return (
      <div className="order-bill-table">
        {
          this.props.url === '/recharge-orders' ?
            <Row className="header-count top-stats" justify="space-around">
              <Col span={5}>
                <em>今日成功：<i>{this.state.orderStats.today.count}笔</i></em>
                <span>¥{this.state.orderStats.today.rmb}</span>
              </Col>
              <Col span={5}>
                <em>今日失败：<i>{this.state.orderStats.todayFail.count}笔</i></em>
                <span>¥{this.state.orderStats.todayFail.rmb}</span>
              </Col>
              <Col span={5}>
                <em>总待支付：<i>{this.state.orderStats.todayPending.count}笔</i></em>
                <span>¥{this.state.orderStats.todayPending.rmb}</span>
              </Col>
              <Col span={5}>
                <em>总充值：<i>{this.state.orderStats.total.count}笔</i></em>
                <span>¥{this.state.orderStats.total.rmb}</span>
              </Col>
            </Row>
            : null
        }
        {
          this.props.url === '/expert-case-orders' ?
            <Row className="header-count top-stats" justify="space-around">
              <Col span={5}>
                <em>今日购买：<i>{this.state.orderStats.totalBuy.count}笔</i></em>
                <span>¥{this.state.orderStats.totalBuy.amount/100}</span>
              </Col>
              <Col span={5}>
                <em>今日退款：<i>{this.state.orderStats.totalFund.count}笔</i></em>
                <span>¥{this.state.orderStats.totalFund.amount/100}</span>
              </Col>
              <Col span={5}>
                <em>总购买：<i>{this.state.orderStats.totalBuy.count}笔</i></em>
                <span>¥{this.state.orderStats.totalBuy.amount/100}</span>
              </Col>
              <Col span={5}>
                <em>总退款：<i>{this.state.orderStats.totalFund.count}笔</i></em>
                <span>¥{this.state.orderStats.totalFund.amount/100}</span>
              </Col>
            </Row>
            : null
        }
        {
          this.props.url === '/recharge-bills' ?
            <Row className="header-count top-stats" justify="space-around">
              <Col span={5}>
                <em>今日成功：<i>{this.state.orderStats.today.count}笔</i></em>
                <span>¥{this.state.orderStats.today.rmb}</span>
              </Col>
              <Col span={5}>
                <em>今日Android充值：<i>{this.state.orderStats.todayAndroid.count}笔</i></em>
                <span>¥{this.state.orderStats.todayAndroid.rmb}</span>
              </Col>
              <Col span={5}>
                <em>今日iOS充值：<i>{this.state.orderStats.todayIos.count}笔</i></em>
                <span>¥{this.state.orderStats.todayIos.rmb}</span>
              </Col>
              <Col span={5}>
                <em>总充值：<i>{this.state.orderStats.total.count}笔</i></em>
                <span>¥{this.state.orderStats.total.rmb}</span>
              </Col>
            </Row>
            : null
        }
        {
          this.props.url === '/expert-case-bills' ?
            <Row className="header-count top-stats" justify="space-around">
              <Col span={5}>
                <em>今日购买：<i>{this.state.orderStats.totalBuy.count}笔</i></em>
                <span>¥{this.state.orderStats.totalBuy.amount/100}</span>
              </Col>
              <Col span={5}>
                <em>今日退款：<i>{this.state.orderStats.totalFund.count}笔</i></em>
                <span>¥{this.state.orderStats.totalFund.amount/100}</span>
              </Col>
              <Col span={5}>
                <em>总购买：<i>{this.state.orderStats.totalBuy.count}笔</i></em>
                <span>¥{this.state.orderStats.totalBuy.amount/100}</span>
              </Col>
              <Col span={5}>
                <em>总退款：<i>{this.state.orderStats.totalFund.count}笔</i></em>
                <span>¥{this.state.orderStats.totalFund.amount/100}</span>
              </Col>
            </Row>
            : null
        }
        
        <Row className="search antd-mb" justify="end">
          <Select className="antd-mr" onChange={this.handleChange} value={this.state.status}>
            {
              this.props.statusList.map((res, index) => {
                return (
                  <Option value={res.value} key={index}>{res.name}</Option>
                )
              })
            }
          </Select>
          {/* <Input addonBefore={selectBefore} className="antd-ml8" style={{ width: 300 }} placeholder="请输入" value={this.state.searchlogs} onChange={this.handleSearchInput} maxLength={50} /> */}
          <LimitInput widthValue={300} regType='number' addonBefore={selectBefore} placeholder="请输入" value={this.state.searchlogs} getValue={this.handleSearchInput} limit={this.state.searchType === '1' ? 19 : 11} />
          <Button onClick={this.handleSearch} className="antd-ml8">搜索</Button>
          <Button className="antd-ml8" type="primary" onClick={this.getList.bind(this)}>刷新数据</Button>
        </Row>
        <Table rowKey="id"
          columns={this.columns} dataSource={this.state.data}
          pagination={{
            total: this.state.total,
            pageSize: this.state.pageSize,
            current: this.state.pageIndex,
            onChange: this.changePage,
            showTotal: this.showTotal,
            onShowSizeChange: this.onShowSizeChange,
            showSizeChanger: true
          }}
        />
        <Modal
          title={this.props.topup ? '充值详情' : '购买详情'}
          footer={false}
          visible={this.state.visible}
          onCancel={this.onCancel}
        >
          <NormalModal url={this.props.url} data={this.state.modalData} />
        </Modal>
      </div>
    )
  }
}

export default OrderTable;

OrderTable.defaultProps = {
  data: [],
  topup: false,
  buy: false,
  change: false
}
