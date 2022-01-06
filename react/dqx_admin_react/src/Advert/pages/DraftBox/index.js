import React from 'react';
import moment from 'moment';
import { Input, Button, DatePicker, Table, Modal, message, Select } from 'antd';

import { getAdvDetails, deleteSingAd } from '@api/advGroup.js';

import { ExclamationCircleOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

class DraftBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      searchlogs: '',
      date: null,
      dateString: ['', ''],
      startTime: 0,
      endTime: 0,
      data: [],
      platform: 0, // 客户端类型：0-APP 1-直播PC端,
    }

    this.columns = [
      {
        key: 'secondLevelModule',
        title: '投放模块',
        align: 'center',
        dataIndex: 'secondLevelModule'
      },
      {
        key: 'thirdLevelModule',
        title: '投放页面',
        align: 'center',
        dataIndex: 'thirdLevelModule'
      },
      {
        key: 'title',
        title: '标题',
        align: 'center',
        dataIndex: 'title'
      },
      {
        key: 'firstLevelModule',
        title: '体育模块',
        align: 'center',
        dataIndex: 'firstLevelModule'
      },
      {
        key: 'createTime',
        title: '保存时间',
        align: 'center',
        dataIndex: 'createTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
      },
      {
				key: 'action',
        title: '调整',
        align: 'center',
				render: (text, record, index) => (
					<span>
						<Button type="link" onClick={() => this.handleEdit(record, index)}>编辑</Button>
            <Button type="link" danger onClick={() => this.handleDelete(record, index)}>删除</Button>
					</span>
				)
			}
    ]
  }

    
	/**
	 * 搜索框onchange事件
	 * @param {event} current -搜索框
	 */
  handleSearchInput = (current) => {
    this.setState({
			searchlogs: current.target.value
		})
  }

  /**
   * 搜索框重置
   */
  handleRest = () => {
    this.setState({
			searchlogs: ''
    }, () => {
      this.handleSearch();
    })
  }

  /**
   * 搜索
   */
  handleSearch = () => {
   const params = {
    title: this.state.searchlogs
   }
   this.getList(params)
  }

  /**
   * 
   * @param {[moment, moment]} values - 获取Moment
   * @param {[string, string]} dateStrings - 获取["2020-03-02", "2020-04-14"] 形式日期
   */
  changeDate = (values, dateStrings) => {
    this.setState(
      {
				date: values,
        dateString: dateStrings,
        startTime: new Date(dateStrings[0]).getTime(),
        endTime: new Date(dateStrings[1]).getTime()
      }
    )
    let params = {
      start: dateStrings[0] == null || dateStrings[0] === '' ? '' :new Date(dateStrings[0]).getTime(),
      end: dateStrings[1] == null || dateStrings[1] === '' ? '' :new Date(dateStrings[1]).getTime()
    }
    this.getList(params)
  }

   /**
   * 翻页
   * @param {number} page 
   */
  changePage = (page) => {
    this.setState({
      pageIndex: page
    })
    const params = {
      isDeleted: false,
      page: page,
      page_size: this.state.pageSize
    }
    this.getList(params)
  }

    /**
   * 提示表格共有多少条
   * @param {*} total 
   * @param {*} range 
   */
  showTotal = (total, range) => {
    return `共有${total}条数据，当前每页最多显示10条`
  }

  /**
   * 编辑
   * @param {object} data - 获取当前行数据
   * @param {number} index - 获取当前行数
   */
  handleEdit = (data, index) => {
    const id = data.id
    this.props.history.push(`/createAd?id=${id}`)
  }

    /**
   * 二次确认是否删除
   * @param {*} obj 
   * @param {*} index 
   */
  handleDelete = (obj, index) => {
    const modal = Modal.confirm()
    modal.update({
      content: '删除后广告组内容将不可恢复， 确定要删除吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.deleteSingle(obj.id)
      },
      onCancel() {
			},
    })
  }

  
  /**
   * 获取列表
   * @param {*} params 
   */
  async getList(params = {}) {
    Object.assign(params, {
      clientType: this.state.platform,
      isPublished: 0,
      isDeleted: false,
      sortField: 'createTime',
      sortType: 'desc'
    })
    const res = await getAdvDetails(params)
    this.setState({
      data: res.data,
      pageIndex: res.meta.pagination.currentPage,
      pageSize: res.meta.pagination.perPage,
      total: res.meta.pagination.total
    })
  }

  /**
   * 删除
   * @param {*} id 
   */
  async deleteSingle(id) {
    await deleteSingAd(id)
    message.info('删除成功')
    const params = {
      isDeleted: false,
      page: this.state.pageIndex,
      page_size: this.state.pageSize
    };
    this.getList(params);
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

  componentDidMount () {
    this.getList()
  }

  //如果有异步设置state值的情况，在组件销毁时清除所有的state状态
  componentWillUnmount() {
     this.setState = (state, callback) => {
      return
    }
  }

  render() {
    return (
      <div className="draftbox">
        <div className="select-group antd-mb">
        <label>投放平台：</label>
          <Select className="antd-mr antd-ml8" style= {{width: 200}} defaultValue={0} value={this.state.platform} onChange={this.handlePlatform}>
            <Option key={0} value={0}>APP</Option>
            <Option key={1} value={1}>直播PC端</Option>
          </Select>
          <label>搜索：</label><Input className="antd-mr" placeholder="请输入" style= {{width: 300}} value={this.state.searchlogs} onChange={this.handleSearchInput} maxLength={50}/>
          <Button className="antd-mr" type="primary" onClick={this.handleSearch}>查询</Button><Button className="antd-mr" type="default" onClick={this.handleRest}>重置</Button>
          <RangePicker value={this.state.date} onChange = {this.changeDate}/>
        </div>
        <Table rowKey="id"
          columns={this.columns} dataSource={this.state.data}
          pagination = {{
            total: this.state.total,
            pageSize: this.state.pageSize,
            current: this.state.pageIndex,
            onChange: this.changePage,
            showTotal: this.showTotal
          }} 
        />
      </div>
    )
  }
}

export default DraftBox;