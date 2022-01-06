import React from 'react';
import { Input, Button, Table, Modal, Row, Col, Checkbox, Switch, Tabs, message, Select } from 'antd';
import { getAdvGroup, getTimes, addAdvGroup, putAdvGroup, patchAdvGroup, getAdvGroupSingle, delAdvGroup } from '@api/advGroup'
import './index.scss'

const { TabPane } = Tabs;
const { Option } = Select;
const { confirm } = Modal;


class AdGroup extends React.Component {
  /**
   * data定义
   */
  state = {
    filteredInfo: null,
    sortedInfo: null,
    isAdd: false,   //弹窗是否打开
    data: [],   //表格数据
    dayList: { modeType: {}, list: [] },    //时间选择-日期
    weekList: { modeType: {}, list: [] },   //时间选择-周
    state: '1',   //列表筛选-状态
    platformType: '',    //-列表筛选-平台
    advGroupName: '',   //新建广告组-名称
    platApp: [],   //新建广告组-平台
    timeType: '1',    //新建广告组-时间类型
    searchKey: '',    //搜索框value
    creatText: 'create',    //区分创建还是编辑
    id: 0,    //  广告组ID
    platform: 0, // 客户端类型：0-APP 1-直播PC端,
    checkedPC: false // 选择pc
  };

  /**
   * 提交数据校验
   */
  async checkData() {
    return new Promise((res, rej) => {
      let isAndroid = false;
      let isiOS = false;
      if (this.state.advGroupName === '') {
        message.warning('请输入名称')
        return
      }
      if (this.state.platApp.length === 0 && !this.state.checkedPC) {
        message.warning('请选择投放平台')
        return
      } else {
        if (this.state.platApp.includes('Android')) {
          isAndroid = true;
        }
        if (this.state.platApp.includes('iOS')) {
          isiOS = true;
        }
      }
      let timeChoosed = false;
      this.state.dayList.list.map(res => {
        res.list.map(item => {
          if (item.selected) {
            timeChoosed = true;
          }
        })
      })
      this.state.weekList.list.map(res => {
        res.list.map(item => {
          if (item.selected) {
            timeChoosed = true;
          }
        })
      })
      if (!timeChoosed) {
        message.warning('请选择投放时间')
        return
      }

      let data = {
        clientType: this.state.checkedPC ? 1:0,
        groupVo: { byDay: this.state.dayList, byWeek: this.state.weekList },
        mode: this.state.timeType,
        name: this.state.advGroupName
      }
      if (!this.state.checkedPC) {
        Object.assign(data, {
          advertiseAbleAndroid: isAndroid,
          advertiseAbleIos: isiOS
        })
      }
      return res(data)
    })
  }


  /**
   * 提交接口
   */
  async handleOk() {
    const data = await this.checkData();
    addAdvGroup(data).then(_ => {
      this.getList();
      this.getTimesList();
      this.setState({
        isAdd: false,
        platApp: [],
        advGroupName: '',
        checkedPC: false
      })
      message.info('添加成功')
    })
  }


  /**
   * 修改
   * @param {*} e 
   * @param {Number} id  -数据ID
   */
  async updateItems(e) {
    getAdvGroupSingle(e).then(res => {
      const data = res.data;
      let platApp = [];
      if (data.advertiseAbleAndroid) {
        platApp.push('Android');
      }
      if (data.advertiseAbleIos) {
        platApp.push('iOS')
      }
      this.setState({
        platform: data.clientType.value,
        checkedPC: data.clientType? true: false,
        id: data.id,
        advGroupName: data.name,
        timeType: data.mode.value.toString(),
        dayList: data.promotionTimes.byDay,
        weekList: data.promotionTimes.byWeek,
        creatText: 'update',
        platApp: platApp,
        isAdd: true,
      })
    })
  }

  /**
   * 修改提交接口
   */
  async handlePut() {
    const data = await this.checkData();
    putAdvGroup(this.state.id, data).then(_ => {
      message.info('修改成功')
      this.getList();
      this.setState({
        isAdd: false
      })
    })
  }


  /**
   * 删除广告组
   * @param {Number} e -选项id 
   */
  async delItems(e) {
    let _this = this;
    confirm({
      content: '删除广告组之后广告将会被全部清空，是否确认删除？',
      okText: '确认',
      onOk() {
        delAdvGroup(e).then(_ => {
          message.info('删除成功');
          _this.getList();
        })
      },
      onCancel() {
      },
    });
  }



  /**
   * 
   * @param {Boolean} e -切换广告状态
   */
  async onStatusChange(index, e, val) {
    let data = { enable: val }
    patchAdvGroup(e, data).then(_ => {
      this.getList()
    })
  }


  /**
   * 
   * @param {*} e -状态选中值
   */
  async changeState(e) {
    // this.state.state = e;
    this.setState({
      state: e
    }, () => {
      this.getList();
    });
  }

  /**
   * 
   * @param {*} e -平台选中值
   */
  async changePlatForm(e) {
    // this.state.platformType = e;
    this.setState({
      platformType: e
    }, () => {
      this.getList();
    });
  }

  /**
   * 
   * @param {event} e -搜索关键字
   */
  async searchKeyInput(e) {
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
    this.setState({
      searchKey: ''
    }, () => {
      this.getList()
    })
  }

  /**
   * 
   * @param {Number} key -获取tab选中参数
   */
  async callback(key) {
    if (key == 2) {
      const weekList = this.state.weekList;
      weekList.list.map(res => {
        res.selected = false;
        res.isIndeterminate = false;
        res.list.map(item => {
          item.selected = false;
        })
      })
    } else {
      const dayList = this.state.dayList;
      dayList.list.map(res => {
        res.selected = false;
        res.isIndeterminate = false;
        res.list.map(item => {
          item.selected = false;
        })
      })
    }
    this.setState({
      timeType: key
    })
  }

  /**
   * 获取名称输入框的值
   * @param {String} event --名称输入框的值
   */
  async getNameInput(event) {
    this.setState({
      advGroupName: event.target.value,
    })
  };

  /**
   * 弹窗取消操作
   */
  async handleCancel() {
    this.setState({
      isAdd: false
    })
  }

  /**
   * 选择平台
   * @param { Array } checkedValues -选中的数组
   */
  async onChangePlat(checkedValues) {
    this.setState({
      platApp: checkedValues
    })
  }

  /**
   * 单天选择时间复选框全选/全不选
   * @param { Number } e --当前复选框所在的数组下标
   */
  async onCheckAllChange(e) {
    const dayList = this.state.dayList;
    dayList.list[e].isIndeterminate = false;
    dayList.list[e].selected = dayList.list[e].selected ? false : true;
    if (dayList.list[e].selected) {
      dayList.list[e].list.map(res => (res.selected = true))
    } else {
      dayList.list[e].list.map(res => (res.selected = false))
    }
    this.setState({})
  }


  /**
   * 单天时间选择框单选
   * @param { Number } e --当前复选框父级所在的数组下标
   * @param { Number } val --当前复选框所在的数组下标
   */
  async onChange(e, val) {
    const dayList = this.state.dayList;
    dayList.list[e].list[val].selected = dayList.list[e].list[val].selected ? false : true;
    // 部分选中
    if (dayList.list[e].list.findIndex(res => res.selected === true) > -1) {
      dayList.list[e].selected = false;
      dayList.list[e].isIndeterminate = true;
    }
    // 全选
    if (dayList.list[e].list.findIndex(res => res.selected === false) <= -1) {
      dayList.list[e].selected = true;
      dayList.list[e].isIndeterminate = false;
    }
    // 全不选
    if (dayList.list[e].list.findIndex(res => res.selected === true) <= -1) {
      dayList.list[e].selected = false;
      dayList.list[e].isIndeterminate = false;
    }
    this.setState({})
  }



  /**
   * 按周选择时间选择框单选
   * @param { Number } e --当前复选框父级所在的数组下标
   * @param { Number } val --当前复选框所在的数组下标
   */
  async onWeekChange(e, val) {
    const weekList = this.state.weekList;
    weekList.list[e].list[val].selected = weekList.list[e].list[val].selected ? false : true;
    // 部分选中
    if (weekList.list[e].list.findIndex(res => res.selected === true) > -1) {
      weekList.list[e].selected = false;
      weekList.list[e].isIndeterminate = true;
    }
    // 全选
    if (weekList.list[e].list.findIndex(res => res.selected === false) <= -1) {
      weekList.list[e].selected = true;
      weekList.list[e].isIndeterminate = false;
    }
    // 全不选
    if (weekList.list[e].list.findIndex(res => res.selected === true) <= -1) {
      weekList.list[e].selected = false;
      weekList.list[e].isIndeterminate = false;
    }
    this.setState({})
  }




  /**
   * 按周选择时间复选框全选/全不选
   * @param { Number } e --当前复选框所在的数组下标
   */
  async onWeekCheckAllChange(e) {
    const weekList = this.state.weekList;
    weekList.list[e].isIndeterminate = false;
    weekList.list[e].selected = weekList.list[e].selected ? false : true;
    if (weekList.list[e].selected) {
      weekList.list[e].list.map(res => (res.selected = true))
    } else {
      weekList.list[e].list.map(res => (res.selected = false))
    }
    this.setState({})
  }


  /**
   * 获取广告组列表
   */
  async getList() {
    let data = {
      clientType:this.state.platform,
      status: this.state.state,
      name: this.state.searchKey
    }
   if (this.state.platform === 0) {
    Object.assign(data, {platformType: this.state.platformType})
   }
    const res = await getAdvGroup(data);
    this.setState({
      data: res.data,
    })
  }

  /**
   * 获取时间列表
   */
  async getTimesList() {
    const res = await getTimes();
    this.setState({
      dayList: res.data.byDay,
      weekList: res.data.byWeek
    })
  }

  /**
   * 查看详情
   */
  searchDetail = (id) => {
   this.props.history.push(`/AdGroup/details?id=${id}`)
  }

  /**
 * - 新增广告组
 */
  handleAddAdGroup = () => {
    this.getTimesList();
    this.setState({
      creatText: 'create',
      timeType: '1',
      advGroupName: '',
      platApp: [],
      isAdd: true,
      checkedPC: false,
      platform: 0
    })
  }


  /**
   * 排序相关
   */
  handleChange = (el, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
    this.getList()
  };

  
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
   * 选择PC端
   */
  onChangePC = e => {
    this.setState({
      checkedPC: e.target.checked
    })
  }

  /**
   * 生命周期挂载
   */
  componentDidMount() {
    this.getList();
    this.getTimesList();
  }

  //如果有异步设置state值的情况，在组件销毁时清除所有的state状态
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return
		}
	}

  render() {
    const timeItems = (
      <Tabs defaultActiveKey={this.state.timeType} onChange={this.callback.bind(this)} activeKey={this.state.timeType}>
        <TabPane tab={this.state.weekList.modeType.display} key="1">
          {
            this.state.weekList.list.map((item, index) => {
              return (
                <div key={index} className="list-margin">
                  <Checkbox
                    indeterminate={item.isIndeterminate && !item.selected}
                    checked={item.selected}
                    key={item.timeDateType.value}
                    className="check-all"
                    onChange={this.onWeekCheckAllChange.bind(this, index)}
                  >
                    {item.timeDateType.display}
                  </Checkbox>
                  {
                    item.list.map((items, indexs) => {
                      return (
                        <Checkbox
                          checked={items.selected}
                          key={items.id}
                          value={items.id}
                          onChange={this.onWeekChange.bind(this, index, indexs)}
                        >
                          {items.hourOfDay}
                        </Checkbox>
                      )
                    })
                  }
                </div>
              )
            })
          }
        </TabPane>
        <TabPane tab={this.state.dayList.modeType.display} key='2'>
          {
            this.state.dayList.list.map((item, index) => {
              return (
                <div key={index} className="list-margin">
                  <Checkbox
                    indeterminate={item.isIndeterminate && !item.selected}
                    checked={item.selected}
                    key={item.timeDateType.value}
                    className="check-all"
                    onChange={this.onCheckAllChange.bind(this, index)}
                  >
                    {item.timeDateType.display}
                  </Checkbox>
                  {
                    item.list.map((items, indexs) => {
                      return (
                        <Checkbox
                          checked={items.selected}
                          key={items.id}
                          value={items.id}
                          onChange={this.onChange.bind(this, index, indexs)}
                        >
                          {items.hourOfDay}
                        </Checkbox>
                      )
                    })
                  }
                </div>
              )
            })
          }
        </TabPane>

      </Tabs>
    )

    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: '广告组名称',
        align: 'center',
        dataIndex: 'name'
      },
      {
        title: '广告数',
        align: 'center',
        dataIndex: 'adCount'
      },
      {
        title: '状态',
        align: 'center',
        render: (text, item, index) => (
          <span>{item.status.display}</span>
        )
      },
      {
        title: '投放平台',
        align: 'center',
        dataIndex: 'platform'
      },
      {
        title: '展示次数',
        dataIndex: 'displayTimes',
        key: 'displayTimes',
        align: 'center',
        sorter: (a, b) => a.displayTimes - b.displayTimes,
        sortOrder: sortedInfo.columnKey === 'displayTimes' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: '点击次数',
        dataIndex: 'clickTimes',
        key: 'clickTimes',
        align: 'center',
        sorter: (a, b) => a.clickTimes - b.clickTimes,
        sortOrder: sortedInfo.columnKey === 'clickTimes' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: '点击率',
        dataIndex: 'clickRate',
        key: 'clickRate',
        align: 'center',
        sorter: (a, b) => a.clickRate - b.clickRate,
        sortOrder: sortedInfo.columnKey === 'clickRate' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: '投放周期(天/周)',
        align: 'center',
        render: (text, item, index) => (
          <span>{item.mode.display}</span>
        )
      },
      {
        title: '是否启用',
        align: 'center',
        render: (text, item, index) => (
          <Switch onChange={this.onStatusChange.bind(this, index, item.id)} checked={item.enable} />
        )
      },
      {
        key: 'action',
        title: '操作',
        width: 250,
        align: 'center',
        render: (text, item, index) => (
          <span>
            <Button type="link" onClick={() => this.searchDetail(item.id)}>查看</Button>
            <Button type="link" onClick={this.updateItems.bind(this, item.id)}>修改</Button>
            <Button type="link" danger onClick={this.delItems.bind(this, item.id)}>删除</Button>
          </span>
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
          选择状态：<Select defaultValue={this.state.state} style={{ width: 120, marginRight: 20 }} onChange={this.changeState.bind(this)} value={this.state.state}>
            <Option value="1">全部</Option>
            <Option value="2">有效</Option>
            <Option value="3">暂停投放</Option>
            <Option value="4">非投放时间</Option>
          </Select>
          {
            this.state.platform == 0
            ?
            <>
            选择平台：<Select defaultValue={this.state.platformType} style={{ width: 120, marginRight: 20 }} onChange={this.changePlatForm.bind(this)} value={this.state.platformType}>
              <Option value="">全部</Option>
              <Option value="2">IOS</Option>
              <Option value="3">Android</Option>
              <Option value="1">IOS&Android</Option>
            </Select>
            </>
          :
          null
          }
          <label>搜索：</label><Input style={{ width: 200 }} placeholder="请输入关键字" allowClear value={this.state.searchKey} onChange={this.searchKeyInput.bind(this)} onPressEnter={this.searchKeyPress.bind(this)}  maxLength={50}/>
          <Button type="primary" onClick={this.handleSearch.bind(this)}>查询</Button>
          <Button onClick={this.reSet.bind(this)}>重置</Button>
          <Button style={{ float: 'right' }} type="primary" onClick={this.handleAddAdGroup}>新增广告组</Button>
        </div>
        <div className="content">
          <Table columns={columns} dataSource={this.state.data} onChange={this.handleChange} rowKey="id" pagination ={false}/>
        </div>
        <Modal
          title={this.state.creatText == 'create' ? '添加广告组' : '编辑广告组'}
          visible={this.state.isAdd}
          onCancel={this.handleCancelAdd}
          onOk={this.state.creatText == 'create' ? this.handleOk.bind(this) : this.handlePut.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          className="for-input"
        >
          <div className='modal-item'><i>名称：</i><Input placeholder="请输入名称" onChange={this.getNameInput.bind(this)} value={this.state.advGroupName} maxLength={10}/></div>
          <div className='modal-item'><i>投放平台：</i>
            <Checkbox.Group onChange={this.onChangePlat.bind(this)} value={this.state.platApp}  disabled={this.state.checkedPC}>
              <Row>
                <Col>
                  <Checkbox value="Android">Android</Checkbox>
                </Col>
                <Col>
                  <Checkbox value="iOS">IOS</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
            <Checkbox checked={this.state.checkedPC} disabled={this.state.platApp.length > 0} onChange={this.onChangePC}>PC端</Checkbox>
          </div>
          <div className="time-choose">{timeItems}</div>
        </Modal>
      </div>
    );
  }
}


export default AdGroup;                                                                                    
