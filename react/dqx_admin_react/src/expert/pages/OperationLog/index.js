import React from 'react';
import moment from 'moment';
import { Input, DatePicker, Button, Table } from 'antd';

import { operateLogs } from '../../api/settings';

const { RangePicker } = DatePicker;

class OperationLog extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      searchlogs: '',
      date: null,
      dateString: ['', ''],
      startTime: '',
      endTime: '',
      data: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }

    this.columns = [
      {
        key: 'content',
        title: '操作行为',
        render: (text, record,index) => (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
            {record.content}
          </div>
        ),
      },
      {
        key:'operatorName',
        title: '操作人',
        dataIndex:'operatorName',
        width: 200,
      },
      {
        key: 'createdAt',
        title: '操作时间',
        width: 200,
        render: (text, item, index) => (
          <span>{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
        )
      }
    ];
  }

  /**
   *  搜索
  */
  handleSearch = () => {
    this.setState({
			pageIndex: 1
		}, () => {
      this.getList()
    })
  }
  
  /**
   * 重置时间
   */
  handleDateRest = () => {
    this.setState(
      {
        date: null,
        dateString: ['', ''],
        startTime: '',
        endTime: '',
        pageIndex: 1
      }, () => {
        this.getList()
      }
    )
  }

  /**
   * 重置搜索框
   */
  handleLogsRest = () => {
    this.setState(
      {
        searchlogs: '',
        pageIndex: 1
      }, () => {
        this.getList()
      }
    )
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
        startTime: dateStrings[0] == null || dateStrings[0] === '' ? '' :new Date(dateStrings[0]).getTime(),
        endTime: dateStrings[1] == null || dateStrings[1] === '' ? '' :new Date(dateStrings[1]).getTime()
      }
    )
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
  * 搜索的键盘事件
  * @param {*} e 
  */
  async searchKeyPress(e) {
    this.setState({
      pageIndex: 1,
      searchlogs: e.target.value
  }, () => {
    this.getList()
  })
  }

    /**
   * 获取广告组列表
   */
  async getList() {
    let params = {
      page: this.state.pageIndex,
      page_size: this.state.pageSize,
      start: this.state.startTime,
      end: this.state.endTime,
      // content: this.state.searchlogs
    }

    const res = await operateLogs(params)
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

  componentDidMount() {
   this.getList()
  }

  render () {
    return (
		<div className="logs">
			<div className="header" style={{display: 'flex', justifyContent: 'flex-end'}}>
        {/* <label>搜索：</label><Input className="antd-mr" placeholder="请输入" style= {{width: 300}} value={this.state.searchlogs} onChange={this.handleSearchInput} onPressEnter={this.searchKeyPress.bind(this)}  />
        <Button type="primary" onClick={this.handleSearch}>查询</Button>
				<Button className="antd-mr" type="default" onClick={this.handleLogsRest}>重置</Button> */}
        <label>选择日期：</label><RangePicker value={this.state.date} onChange = {this.changeDate} />
				<Button type="primary" onClick={this.handleSearch}>查询</Button>
				<Button type="default" onClick={this.handleDateRest}>重置</Button>
			</div>
      <Table columns={this.columns} dataSource={this.state.data} rowKey="id" 
      pagination = {{
        total: this.state.total,
        pageSize: this.state.pageSize,
        current: this.state.pageIndex,
        onChange: this.changePage,
        showTotal: this.showTotal,
        onShowSizeChange: this.onShowSizeChange
      }}
      />
		</div>
    );
  }
}

export default OperationLog;