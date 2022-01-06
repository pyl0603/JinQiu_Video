import React from 'react';
import { Row, Col,Form, Input, Button, Table, Switch, Modal, Checkbox, message, Select } from 'antd';

import { getAdSpacesList, getAdSpace, updateAdSpace, changeEnableStatus } from '@api/adSpaces.js';

import { ArrowRightOutlined } from '@ant-design/icons';
import './style.scss';
const { Option } = Select;


const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: {
    offset: 10,
    span: 16,
  },
};

class AdSettings extends React.Component {
  formRef = React.createRef();

  constructor() {
    super()
    /**
     * 表头名和对应字段
     */
    this.columns = [
      {
        key: 'firstLevelModule',
        title: '体育模块',
        align: 'center',
        dataIndex: 'firstLevelModule'
      },
      {
        key: 'secondLevelModule',
        title: '所属模块',
        align: 'center',
        dataIndex: 'secondLevelModule'
      },
      {
        key: 'thirdLevelModule',
        title: '所属页面',
        align: 'center',
        dataIndex: 'thirdLevelModule'
      },
      {
        key: 'location',
        title: '规则',
        align: 'center',
        dataIndex: 'location'
      },
      {
        key: 'maxNumber',
        title: '数量',
        align: 'center',
        dataIndex: 'maxNumber'
      },
      {
        key: 'spaceStyles',
        title: '广告样式',
        align: 'center',
        dataIndex: 'spaceStyles',
        render: (text, record, index) => (
          <span>{record.thirdLevelModule === '帖子列表' ? record.thirdLevelModule: record.spaceStyles}</span>
        )
      },
      {
        key: 'enable',
        title: '是否启用',
        align: 'center',
        render: (text, record, index) => (
          <Switch checked={record.enable} onChange={() => this.handleChangeStatus(!record.enable, record)} />
        )
      },
      {
        key: 'action',
        title: '操作',
        align: 'center',
        render: (text, record, index) => (
          <span>
            <Button type="link" onClick={() => this.handleEdit(record, index)}>编辑</Button>
          </span>
        )
      }
    ];

    this.state = {
      isEdit: false,
      editData: {},
      updateData: {},
      data: [],
      adStylesArr: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      sortNum: 0,
      emissionModalCurrent: undefined,
      sortItems: [],
      isCheckButton: false,
      isCheckPass: false,
			platform: 0
    }
  }

  /**
   * 修改当前状态
   * @param {object} data - 获取当前行数据
   */
  handleChangeStatus = (checked, data) => {
    console.log(checked, data)
    this.changeStatus(data.id, checked)
  }

  /**
   * 
   * @param {object} data - 获取当前行数据
   * @param {number} index - 获取当前行数
   */
  handleEdit = (data, index) => {
    this.setState({
      editData: data
    }, () => {
      this.getItem(data.id);
    })
  }
  /**
 * 
 * @param {*} 
 * 确认修改
 */
  handleOkEdit = () => {
    if (!this.state.isCheckButton && !this.state.editData.isCanEditLocation) {
      message.error('请先校验规则！')
      return
    }
    if (!this.state.isCheckPass && !this.state.editData.isCanEditLocation) {
      message.error('校验规则不通过！')
      return
    }
    const allParams = this.formRef.current.getFieldsValue();
    const id = this.state.updateData.id;
    const allId = [];
    if (this.state.adStylesArr.length > 1 && this.state.adStylesArr[0].label !== '帖子列表') {
      this.state.adStylesArr.map(res => {
        allId.push(res.styleId.toString())
      })
      let isExis = false;
      allId.map(res => {
        if (!this.state.sortItems.includes(res)) {
          isExis = true
        }
      })
      if (isExis) {
        message.warning('每个广告样式都要添加')
        return
      }
    } else if (this.state.adStylesArr[0].label === '帖子列表') {
      this.state.sortItems = new Array(3).fill(this.state.adStylesArr[0].styleId.toString())
    } else if (this.state.adStylesArr[0].label !== '帖子列表') {
      this.state.sortItems = [this.state.adStylesArr[0].styleId.toString()]
    }
    let param = {
      spaceStyles: this.state.adStylesArr,
      location: allParams.location,
      styleRule: this.state.sortItems,
      maxNumber: allParams.maxNumber
    };
    const seletdArr = this.state.adStylesArr.filter(item => item.checked === true);
    if (seletdArr && seletdArr.length === 0) {
      message.error('至少要选择一个广告样式!');
      return;
    }
    this.editItem(id, param);
  }
	/**
	 * 
	 * @param {*} e 
	 * 取消修改
	 */
  handleCancelEdit = e => {
    this.setState({
      isEdit: false,
      editData: {}
    })
  }

  /**
   * 
   * @param {*} checkedValues 广告样式值选择
   */
  onChange = (checkedValues) => {
    let adStylesArr = this.state.adStylesArr;
    if (this.state.adStylesArr[0].label === '帖子列表') {
      if (checkedValues.length !== 0) {
        adStylesArr.map(item => item.checked = true)
      } else {
        adStylesArr.map(item => item.checked = false)
      }
    } else {
      adStylesArr.filter(item => {
        return checkedValues.indexOf(item.value) !== -1 ? item.checked = true : item.checked = false
      });
    }
  };

  /**
   * 获取广告位列表
   */
  async getList(param = {}) {
    Object.assign(param, {
      clientType: this.state.platform,
      sortField: 'createTime',
      sortType: 'asc',
      page: this.state.pageIndex,
      enable: this.state.status
    })
    const res = await getAdSpacesList(param);
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
   * 提示表格共有多少条
   * @param {*} total 
   * @param {*} range 
   */
  showTotal = (total, range) => {
    return `共有${total}条数据，当前每页最多显示10条`
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

  async handleEmissionModal(e, val) {
    let item = this.state.sortItems;
    item[e] = val;
    this.setState({
      sortItems: item
    })
  }

  /**
   * 增加排序类别
   */
  async pushSort() {
    if (this.state.sortItems.length < this.state.sortNum) {
      this.state.sortItems.push('')
    } else {
      message.info(`最多添加${this.state.sortNum}条`)
      return
    }
    this.setState({})
  }

  /**
   * 获取单独广告位
   */
  async getItem(id) {
    const res = await getAdSpace(id);
    const data = res.data;
    let sortItems = [];
    if (data.spaceStyles.length > 1 ) {
      if(data.styleRule.length != 0){
        sortItems = data.styleRule;
      } else {
        data.spaceStyles.map(_ => {
          sortItems.push('')
        })
      }
    }
    this.state.sortNum = data.spaceStyles.length * data.spaceStyles.length
    this.state.sortItems = sortItems
    this.state.adStylesArr = data.spaceStyles
    // let obj = {};
    // this.state.adStylesArr = data.spaceStyles.reduce((item, next) => {
    //   if (!obj[next.styleId]) {
    //     item.push(next);
    //     obj[next.styleId] = true;
    //   }
    //   return item;
    // }, []);
    this.state.updateData = data;
    this.state.isEdit = true;
    const seletdArr = this.state.adStylesArr.filter(item => item.checked);
    let seletdValue = []
    seletdArr.forEach(item => {
      seletdValue.push(item.value)
    })
    this.state.editData.adgroup = seletdValue
    this.state.editData.isCanEditLocation = !data.isCanEditLocation
    this.setState({}, ()=>{})
    this.formRef.current.setFieldsValue(this.state.editData)
  }

  /**
   * 修改广告位
   */
  async editItem(id, param) {
    await updateAdSpace(id, param);
    message.info('操作成功')
    this.setState({
      isEdit: false,
      isCheckButton: false,
      isCheckPass: false
    }, () => {
      this.getList();
    })
  }

  /**
   * 修改当前的广告位状态
   * @param {*} id 
   */
  async changeStatus(id, status) {
    let data = {
      enable: status
    }
    await changeEnableStatus(id, data);
    this.getList();
  }

  /**
   *  校验规则
   */
  async checked() {
    this.setState({
      isCheckButton: true
    })
    let current = this.state.editData.thirdLevelModule;
    let update = this.formRef.current.getFieldsValue().location;
    let updateNum = Number(update);
    let isCheck = true
    if (current === 'banner') {
        if (updateNum > 6 || updateNum < 1) {
          message.error('banner规则只允许1-6！');
          isCheck = false
        }
    } else {
      if (updateNum > 15 || updateNum < 5) {
        message.error('规则只允许5-15！');
        isCheck = false
      }
    }

    if (isCheck) {
      message.success('校验规则通过');
      this.setState({
        isCheckPass: true
      })
    }
  }

  /**
   * 规则输入框改变
   * @param {*} e 
   */
  checkedChange = e => {
    e.target.value = e.target.value.replace(/[^\d]/g,'')
    this.formRef.current.setFieldsValue({location: e.target.value})
    this.setState({
      isCheckButton: false,
      isCheckPass: false
    })
  }

  /**
   * 数量输入框改变
   */
  checkedNumberChange =  e => {
    e.target.value = e.target.value.replace(/[^\d]/g,'')
    this.formRef.current.setFieldsValue({maxNumber: e.target.value})
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

  componentDidMount() {
    this.getList();
  }

    //如果有异步设置state值的情况，在组件销毁时清除所有的state状态
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return
    }
  }

  render() {
    return (
      <div className="logs">
        <Row align="middle" justify="center">
						<Col flex="100px">
							<label>投放平台：</label>
						</Col>
						<Col flex="auto">
							<Select className="antd-mr antd-ml8" style={{ width: 200 }} defaultValue={0} value={this.state.platform} onChange={this.handlePlatform}>
								<Option key={0} value={0}>APP</Option>
								<Option key={1} value={1}>直播PC端</Option>
							</Select>
						</Col>
				</Row>
        <Table columns={this.columns} dataSource={this.state.data}
          pagination={{
            total: this.state.total,
            pageSize: this.state.pageSize,
            current: this.state.pageIndex,
            onChange: this.changePage,
            showTotal: this.showTotal,
            onShowSizeChange: this.onShowSizeChange
          }
          }
          rowKey="id" />
        {
          this.state.editData.id &&
          <Modal
            title="广告位设置"
            visible={this.state.isEdit}
            onCancel={this.handleCancelEdit}
            footer={null}
          >
            <Form
              ref={this.formRef}
              {...layout}
              // initialValues={this.state.editData}
            >
              <Form.Item
                label="体育模块"
                name="firstLevelModule"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="所属模块"
                name="secondLevelModule"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="所属页面"
                name="thirdLevelModule"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="规则"
                className="location"
              >
                <Form.Item
                  name="location"
                  noStyle
                >
                  <Input disabled={this.state.editData.isCanEditLocation} onChange={this.checkedChange} maxLength={2} />
                </Form.Item>
                {
                this.state.editData.isCanEditLocation 
                ?
                null
                :
                <Button className="antd-ml8" onClick={this.checked.bind(this)}>校验</Button>
                }
              </Form.Item>
              <Form.Item
                label="数量"
                name="maxNumber"
              >
                <Input disabled onChange={this.checkedNumberChange}  maxLength={5}/>
              </Form.Item>
              <Form.Item
                label="广告样式"
                name="adgroup"
              >
                <Checkbox.Group onChange={this.onChange}>
                  {
                    this.state.adStylesArr.length > 0 && this.state.adStylesArr[0].label === '帖子列表'
                    ?
                    <Checkbox value={this.state.adStylesArr[0].value}>{this.state.adStylesArr[0].label}</Checkbox>
                    :
                    this.state.adStylesArr.map((item, index) => {
                      return <Checkbox key={index} value={item.value}>{item.label}</Checkbox>
                    })
                  }
                </Checkbox.Group>
              </Form.Item>
              {
                this.state.sortItems.length > 1 && this.state.adStylesArr[0].label !== '帖子列表' ?  (
                  <Form.Item
                    label="排序"
                  >
                    {this.state.sortItems.map((res, index) => {
                      return (
                        <span key={index}>
                          <Select className="antd-mr antd-ml8 antd-mt" style={{ width: 120 }} placeholder="请选择" defaultValue={res} value={this.state.emissionModalCurrent} onChange={this.handleEmissionModal.bind(this, index)}>
                            {
                              this.state.adStylesArr.map((item, index) => {
                                return <Option key={index} value={item.styleId.toString()}>{item.label}</Option>
                              })
                            }
                          </Select>
                          <ArrowRightOutlined />
                        </span>
                      )
                    })}
                    <Button type="link" onClick={this.pushSort.bind(this)}>
                      新增
                    </Button>
                  </Form.Item>) : null
              }
              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" onClick={this.handleOkEdit}>
                  确认
              </Button>
              </Form.Item>
            </Form>
          </Modal>
        }
      </div>
    )
  }
}

export default AdSettings;
