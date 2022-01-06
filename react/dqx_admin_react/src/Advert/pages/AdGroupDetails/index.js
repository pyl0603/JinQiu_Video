import React from 'react';
import moment from 'moment';
import { Input, Button, DatePicker, Table, Switch, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import ModuleSelection from '@component/ModuleSelection';
import Preview from '@component/Preview';
import { getAdvDetails, changeEable, getAdvSingleDetails, deleteSingAd, restoreAdvSingle } from '@api/advGroup.js';

import './style.scss';

const { RangePicker } = DatePicker;

const { confirm } = Modal;

class AdGroupDetails extends React.Component {
  constructor(props) {
    super(props)
    let id = null;
    if (!this.props.isOther) {
      id = this.props.location.search.split('=')[1];
    }
    this.state = {
      id: id,
      data: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      searchlogs: '',
      date: null,
      dateString: ['', ''],
      startTime: null,
      endTime: null,
      visible: false,
      adTitle: '',
      preview: [],
      thirdLevelModuleId: null,
      firstLevelModuleId: null,
      secondLevelModuleId: null
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
        key: 'displayTimes',
        title: '展示次数',
        align: 'center',
        dataIndex: 'displayTimes',
        sorter: (a, b) => a.displayTimes - b.displayTimes
      },
      {
        key: 'clickTimes',
        title: '点击次数',
        align: 'center',
        dataIndex: 'clickTimes',
        sorter: (a, b) => a.clickTimes - b.clickTimes
      },
      {
        key: 'clickRate',
        title: '点击率',
        align: 'center',
        dataIndex: 'clickRate',
        sorter: (a, b) => a.clickRate - b.clickRate
      },
      {
				key: 'action',
        title: '调整',
        align: 'center',
				render: (text, record, index) => (
					<span>
            {
              this.props.isOther ?
              <Button type="link" onClick={() => this.handleRestore(record, index)}>还原</Button>
              :
              <>
                <Button type="link" onClick={() => this.handlePreview(record, index)}>预览</Button>
						    <Button type="link" onClick={() => this.handleEdit(record, index)}>编辑</Button>
                <Button type="link" danger onClick={() => this.handleDelete(record, index)}>删除</Button>
              </>
            }
					</span>
				)
			}
    ]

    if (!this.props.isOther) {
      this.columns.splice(7,0, {
        key: 'enable',
        title: '是否启用',
        align: 'center',
        render: (text, record, index) => (
          <Switch checked={record.enable} onChange={() => this.handleChangeStatus(!record.enable, record)} />
        )
      })
    }

    if (this.props.isOther) {
      this.columns.splice(0, 0, {
        key: 'groupName',
        title: '广告组名称',
        align: 'center',
        dataIndex: 'groupName'
      })

      this.columns.splice(8, 0, {
        key: 'deletedTime',
        title: '删除时间',
        align: 'center',
        dataIndex: 'deletedTime',
        render: val => <span>{val ? moment(parseInt(val)).format('YYYY-MM-DD HH:mm:ss'): ''}</span>
      })
    }
    this.formRef = React.createRef();
  }

  /**
   * 页面id
   * @param {*} obj 
   */
  getPageValue = (obj) => {
    console.log('===>', obj)
    this.setState(obj, () => {
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
   * 提示表格共有多少条
   * @param {*} total 
   * @param {*} range 
   */
  showTotal = (total, range) => {
    return `共有${total}条数据，当前每页最多显示10条`
  }

  /**
   * 修改当前状态
   * @param {object} data - 获取当前行数据
   */
  handleChangeStatus = (checked, data) => {
    this.changeStatus(data.id, checked)
  }

  /**
   * 二次确认是否删除
   * @param {*} obj 
   * @param {*} index 
   */
  handleDelete = (obj, index) => {
    const modal = Modal.confirm()
    let _this = this;
    modal.update({
      // title: '确定删除该广告组',
      content: '删除后广告组内容将不可恢复， 确定要删除吗',
      okText: '确认',
      onOk: () => {
        deleteSingAd(obj.id).then(_ => {
          message.info('删除成功');
          _this.getList();
        })
      },
      onCancel() {
      },
    })
  }

  handleRestore = (obj) => {
    let _this = this;
    confirm({
      title: '确定还原该广告',
      icon: <ExclamationCircleOutlined />,
      content: '点击还原将此条广告还原至草稿箱？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        restoreAdvSingle(obj.id).then(_ => {
          message.info('还原成功!')
          _this.getList();
        })
      },
      onCancel() {
      },
    });
  }

  /**
   * 获取列表
   * @param {*} 
   */
  async getList() {
    const params = {
      clientType: this.state.platform,
      groupId: this.state.id,
      sortField: 'createTime',
      sortType: 'desc',
      title: this.state.searchlogs,
      start: this.state.startTime,
      end: this.state.endTime,
      page: this.state.pageIndex,
      page_size: this.state.pageSize,
      isDeleted: false,
      isPublished: true
    };
    if (!this.state.id) {
      Object.assign(params, {
        firstLevelModuleId: this.state.firstLevelModuleId,
        secondLevelModuleId: this.state.secondLevelModuleId,
        thirdLevelModuleId: this.state.thirdLevelModuleId,
      })
    }
    if (this.props.isOther) {
      Object.assign(params, {
        isDeleted: true,
        sortField: 'deletedTime',
        sortType: 'desc',
        isPublished: null
      })
    }
    const res = await getAdvDetails(params)
    this.setState({
      data: res.data,
      pageIndex: res.meta.pagination.currentPage,
      pageSize: res.meta.pagination.perPage,
      total: res.meta.pagination.total
    })
  }

    /**
   * 修改当前的广告位状态
   * @param {*} id 
   */
  async changeStatus(id, status) {
    let data = {
      enable: status
    };
    await changeEable(id, data);
    this.getList();
  }

  /**
   * 删除
   * @param {*} id 
   */
  // async deleteSingle(id) {
  //   await deleteSingAd(id)
  //   this.getList();
  // }

  /**
   * 
   * @param {object} data - 获取当前行数据
   * @param {number} index - 获取当前行数
   */
  handleEdit = (data, index) => {
    const id = data.id
    this.props.history.push(`/createAd?id=${id}`)
  }

  /**
   * 获取预览组件需要的数据格式
   * @param {*} obj 
   * @param {*} index 
   */
  async handlePreview(obj, index) {
    const res = await getAdvSingleDetails(obj.id);
    this.setState({
      preview: []
    }, () => {
      const data = res.data
      const images = data.images
      let isHasTitle;
      let arr = []
      images.forEach((item, id) => {
        let obj = {
          id: item.style.id,
          name: item.style.name,
          title: item.title == null ? '':item.title,
          x: item.style.xpixel,
          y: item.style.ypixel,
          url: item.url
        }
        console.log(arr, item, id)
        isHasTitle = item.style.isHasTitle
        const isobj = arr.find((temp, i) => i === id);
        if (isobj === undefined) {
          arr.push(obj);
        } else {
          isobj.url = obj.url
        }
      })
      this.setState({
        isHasTitle: isHasTitle,
        adTitle: data.title == null ? '': data.title,
        preview: arr,
        visible: true
      })
    })
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
    searchlogs: e.target.value
 }, () => {
  this.getList();
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
    this.getList();
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
        startTime: dateStrings[0] == null || dateStrings[0] === '' ? null :new Date(dateStrings[0]).getTime(),
        endTime: dateStrings[1] == null || dateStrings[1] === '' ?  null  :new Date(dateStrings[1]).getTime()
      }, () => {
        this.getList()
      }
    )
  }

  /**
   * 关闭预览弹窗
   * @param {*} e 
   */
  handleCancel = e => {
    this.setState({
      visible: false
    })
  }

  componentDidMount () {
    if (this.state.id) {
      this.getList();
    }
  }

  //如果有异步设置state值的情况，在组件销毁时清除所有的state状态
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return
		}
	}

  render() {
    return (
        <div className="adgroup-details">
          <div className="select-group antd-mb">
            <label>搜索：</label><Input className="antd-mr" placeholder="请输入" style= {{width: 300}} value={this.state.searchlogs} onChange={this.handleSearchInput} onPressEnter={this.searchKeyPress.bind(this)} maxLength={50}/>
            <Button className="antd-mr" type="primary" onClick={this.handleSearch}>查询</Button><Button className="antd-mr" type="default" onClick={this.handleRest}>重置</Button>
            <RangePicker value={this.state.date} onChange = {this.changeDate}  />
          </div>
         {this.state.id ?
          null
         :
         <ModuleSelection pageId = {this.getPageValue} />
         }
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
          <Modal
          title="预览"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          >
          <div className="adGroupDetail-previer" >
            <Preview isHasTitle={this.state.isHasTitle} reviewTxt={this.state.adTitle} preview={this.state.preview} />
          </div>
        </Modal>
				</div>
      )
  }
}

export default AdGroupDetails;

AdGroupDetails.defaultProps={
  isOther: false  // 调整功能
}
