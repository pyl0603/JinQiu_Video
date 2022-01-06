import React from 'react';
import { Input, Button, Table, Modal, message, Select } from 'antd';
import { delAdvGroupList, restoreAdvGroup } from '@api/advGroup'
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { Option } = Select;

class AdGroup extends React.Component {
  /**
   * data定义
   */
  state = {
    isAdd: false,   //弹窗是否打开
    data: [],   //表格数据
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    platform: 0, // 客户端类型：0-APP 1-直播PC端,
  };

  /**
   * 删除广告组
   * @param {Number} e -选项id 
   */
  async restItems(e) {
    let _this = this;
    confirm({
      title: '确定还原该广告组',
      icon: <ExclamationCircleOutlined />,
      content: '点击还原将此条广告还原至草稿箱？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        restoreAdvGroup(e).then(_ => {
          message.info('还原成功');
          _this.getList();
        })
      },
      onCancel() {
      },
    });
  }

  /**
   * 
   * @param {event} e -搜索关键字
   */
  async searchKeyInput(e) {
    // this.state.searchKey = e.target.value;
    // this.setState({})
    this.setState({
      searchKey: e.target.value
    })
  }

    /**
   * 搜索的键盘事件
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
   * 关键字搜索
   */
  async handleSearch() {
    this.getList()
  }

  /**
   * 重置
   */
  async reSet() {
    // this.state.state = '1'
    // this.state.platformType = '1'
    // this.searchKey = ''
    this.setState({
      state: '1',
      platformType: '1',
      searchKey: ''
    },() => {
      this.getList()
    })
    
  }

  /**
   * 获取广告组列表
   */
  async getList() {
    let data = {
        clientType: this.state.platform,
        page: this.state.pageIndex,
        page_size: this.state.pageSize,
        title: this.state.searchKey,
        sortField: 'deletedTime',
        sortType: 'desc',

    }
    const res = await delAdvGroupList(data);
    this.setState({
      data: res.data,
      pageIndex: res.meta.pagination.currentPage,
      pageSize: res.meta.pagination.perPage,
      total: res.meta.pagination.total
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
	 * 选择平台
	 */
	handlePlatform = (current) => {
		this.setState({
			platform: current
		}, () => {
			this.getList()
		})
  }
  

  /**
   * 生命周期挂载
   */
  componentDidMount() {
    this.getList();
  }

  render() {
    const columns = [
      {
        title: '广告组名称',
        dataIndex: 'name'
      },
      {
        title: '投放平台',
        align: 'center',
        dataIndex: 'platform'
      },
      {
        title: '投放周期(天/周)',
        align: 'center',
        render: (text, item, index) => (
          <span>{item.mode.display}</span>
        )
      },
      {
        key: 'action',
        title: '操作',
        align: 'center',
        render: (text, item, index) => (
            <Button type="link" className="antd-cp" onClick={this.restItems.bind(this, item.id)}>还原</Button>
        )
      }
    ];
    return (
      <div>
        <div className="header">
          <label>投放平台：</label>
          <Select className="antd-mr antd-ml8" style= {{width: 200}} defaultValue={0} value={this.state.platform} onChange={this.handlePlatform}>
            <Option key={0} value={0}>APP</Option>
            <Option key={1} value={1}>直播PC端</Option>
          </Select>
          <label>搜索：</label><Input style={{ width: 200 }} placeholder="请输入关键字" allowClear value={this.state.searchKey} onChange={this.searchKeyInput.bind(this)} onPressEnter={this.searchKeyPress.bind(this)}  maxLength={50}/>
          <Button type="primary" onClick={this.handleSearch.bind(this)}>查询</Button>
          <Button onClick={this.reSet.bind(this)}>重置</Button>
        </div>
        <div className="content">
          <Table columns={columns} dataSource={this.state.data} rowKey="id"  
          pagination = {{
            total: this.state.total,
            pageSize: this.state.pageSize,
            current: this.state.pageIndex,
            onChange: this.changePage
          }} />
        </div>
      </div>
    );
  }
}


export default AdGroup;                                                                                    
