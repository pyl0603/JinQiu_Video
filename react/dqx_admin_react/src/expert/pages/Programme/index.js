import React from 'react';
import moment from 'moment';
import { Table, Select, Button, Input, Modal, Row } from 'antd';
import Det from './det';

import { getPlansList } from '../../api/release';

const { Option } = Select;
let item = {
  '12': 'name1',
  '11': 'name2'
}
for (var key in item) {
  console.log(key, item[key])
}

class Programme extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      playType: "",
      planStatus: "",
      searchKey: '',
      visible: false,
      detData: '',
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    }
  }

  /**
   * 查看方案详情
   * @param { * } e -方案
   */
  async searchDetail(e) {
    console.log(e)
    this.setState({
      visible: true,
      detData: e
    })
  }


  /**
   * 选择玩法
   * @param {*} current -切换玩法
   */
  async changeState(current) {
    this.setState({
      playType: current
    }, () => {
      this.getList()
    })
  }

   /**
    * 选择状态
    * @param {*} current 
    */
  async changePlayState(current) {
    this.setState({
      planStatus: current
    }, () => {
      this.getList()
    })
  }

  /**
   * 获得搜索输入框内容
   * @param {*} e 
   */
  async searchKeyInput(e) {
    this.setState({
      searchKey: e.target.value
    })
  }

  /**
   * 搜索输入框键盘事件
   * @param {*} e 
   */
  async searchKeyPress(e) {
    this.setState({
      searchKey: e.target.value
    }, () => {
      this.getList()
    })
  }

  /**
   * 查询
   */
  async handleSearch() {
    this.setState({
      pageIndex:1
    },() => {
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
   * 重置输入框
   */
  async reSet() {
    this.setState({
      searchKey: '',
      pageIndex: 1
    }, () => {
      this.getList()
    })
  }

  /**
   * 得到数据
   */
  async getList() {
    const params = {
      keys: this.state.searchKey,
      page: this.state.pageIndex,
      page_size: this.state.pageSize,
      // orderField: 1,
      isAsc: false,
      playType: this.state.playType,
      planStatus: this.state.planStatus
    }
    const res = await getPlansList(params)
    console.log(res.data)

    this.setState({
      data: res.data,
      pageIndex: res.meta.pagination.currentPage,
      pageSize: res.meta.pagination.perPage,
      total: res.meta.pagination.total
    })
  }
  /**
   * 关闭详情
   */
  closeModal = () => {
    this.setState({
      visible: false
    })
  }

  componentDidMount() {
    this.getList()
  }

  render() {
    const columns = [
      {
        key: 'competitionName',
        title: '联赛',
        dataIndex: 'competitionName'
      },
      {
        key: 'category',
        title: '方案类型',
        align: 'center',
        render: (text, item, index) => (
          <span>{item.category.display}</span>
        )
      },
      {
        key: 'title',
        title: '方案标题',
        align: 'center',
        dataIndex: 'title'
      },
      {
        key: 'playType',
        title: '玩法',
        dataIndex: 'playType',
        render: (text, item, index) => (
          <span>{item.playType.display}</span>
        )
      },
      {
        key: 'planStatus',
        title: '方案状态',
        render: (text, item, index) => (
          <span>{item.planStatus.display}</span>
        )
      },
      {
        key: 'planPrice',
        title: '方案金额',
        dataIndex: 'planPrice',
        render: (text, item, index) => (
          <span>{item.planPrice.display}</span>
        )
      },
      {
        key: 'buyCount',
        title: '购买',
        align: 'center',
        dataIndex: 'buyCount'
      },
      {
        key: 'readCount',
        title: '被查看数',
        align: 'center',
        dataIndex: 'readCount'
      },
      {
        key: 'createdAt',
        title: '创建时间',
        align: 'center',
        render: (text, item, index) => (
          <span>{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
        )
      },
      {
        key: 'action',
        title: '操作',
        align: 'center',
        render: (text, item, index) => (
          <span>
            <Button type="link" onClick={this.searchDetail.bind(this, item)}>查看</Button>
          </span>
        )
      }
    ]
    return (
      <div>
        <Row className="header" justify="end">
          选择玩法：<Select defaultValue={this.state.playType} style={{ width: 120, marginRight: 20 }} onChange={this.changeState.bind(this)} value={this.state.playType}>
            <Option value={""}>全部</Option>
            <Option value={1}>大小球</Option>
            <Option value={2}>让球</Option>
            <Option value={3}>大小分</Option>
            <Option value={4}>让分</Option>
          </Select>
          选择状态：<Select defaultValue={this.state.planStatus} style={{ width: 120, marginRight: 20 }} onChange={this.changePlayState.bind(this)} value={this.state.planStatus}>
            <Option value="">全部</Option>
            <Option value={1}>待审核</Option>
            <Option value={2}>已发布</Option>
            <Option value={3}>驳回</Option>
          </Select>
          <label>搜索：</label><Input style={{ width: 200 }} placeholder="请输入关键字" allowClear value={this.state.searchKey} onChange={this.searchKeyInput.bind(this)} onPressEnter={this.searchKeyPress.bind(this)} maxLength={50}/>
          <Button type="primary" onClick={this.handleSearch.bind(this)}>查询</Button>
          <Button onClick={this.reSet.bind(this)}>重置</Button>
        </Row>
        <Table columns={columns} dataSource={this.state.data} onChange={this.handleChange} rowKey="id"
          pagination={{
            total: this.state.total,
            pageSize: this.state.pageSize,
            current: this.state.pageIndex,
            onChange: this.changePage
          }}
        />
        <Modal
          visible={this.state.visible}
          title="方案详情"
          onCancel={this.closeModal}
          footer={null}
          className="big-modal"
        >
          <Det data={this.state.detData} key={0} />
        </Modal>
      </div>
    )
  }
}

export default Programme;
