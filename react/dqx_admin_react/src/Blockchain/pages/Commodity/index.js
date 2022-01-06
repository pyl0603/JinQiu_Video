import React from 'react';
import moment from 'moment';
import { Form, Row, Col, Input, Button, Radio, Select, DatePicker, message, InputNumber, Checkbox, Table } from 'antd';

import { releaseGoods, getSingGood, editSingGood } from '@bcapi/deposit';
import UploadImage from '../../../component/UploadImage';
import LimitFormItem  from '../../../component/LimitFormItem';
import './style.scss';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const tailLayout = {
  wrapperCol: {
    offset: 10,
    span: 16,
  },
};

class Commodity extends React.Component {
  constructor(props) {
    super(props)
    // 绑定新增表单
    this.formRef = React.createRef();
    
    this.state = {
      checkNick: false,
      iconUrl: null,
      isEdit: false,
      editId: null,
      isDown: false,
      displayNum: 0,
      data: [],
      price: ''
    }

    this.columns = [
      {
        key: 'operatorName',
        title: '累计库存',
        dataIndex: 'operatorName',
      },
      {
        key: 'operatorName',
        title: '现存库存',
        dataIndex: 'operatorName',
      },
      {
        key: 'operatorName',
        title: '卖出数量',
        dataIndex: 'operatorName',
      }
    ]
  }

  /**
   * 即时商品选择
   * @param {*} e 
   */
  onCheckboxChange = e => {
    this.setState({
      checkNick: e.target.checked
    })
  }

  /**
   * 校验通过的回调
   */
  handleOk = () => {
    const allParams = this.formRef.current.getFieldsValue()
    console.log(allParams)
    if (!this.state.iconUrl) {
      message.error('请上传图标！')
      return
    }
    if (allParams.platformType == null) {
      message.error('请选择所属平台！')
      return
    }
    let params = {
      virtualCurrencyType: Number(allParams.virtualCurrencyType),
      platformType: Number(allParams.platformType),
      amount: Number(allParams.amount),
      price: Number(allParams.price) * 100,
      title: allParams.title,
      display: allParams.display,
      isTimeLimited: this.state.checkNick  
    }
    if (this.state.checkNick) {
      Object.assign(params, {
        startTime: moment(allParams.time[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(allParams.time[1]).format('YYYY-MM-DD HH:mm:ss')
      })
    }
    if (this.state.iconUrl) {
      Object.assign(params, { icon: this.state.iconUrl })
    }
    if (!this.state.isEdit) {
      this.push(params)
    }
    if (this.state.isEdit) {
      this.update(params)
    }
  }

  /**
   * 校验失败的回调
   */
  handleError = () => {
    message.error('有必填内容未填写!');
  }

  /**
   * 图标icon
   */
  handleIcon = url => {
    this.setState({
      iconUrl: url
    })
  }
  
  handleChangePrice = e => {
    console.log(e)
    this.setState({
      price: e
    })
  }

  /**
   * 确认发布
   * @param {*} params 
   */
  async push(params) {
    const res = await releaseGoods(params)
    if (res.code === 0) {
      message.success('发布成功！')
      this.props.history.push({pathname:'/commodity/manage', query: {platformType: params.platformType}});
    }
  }

  /**
   * 确认更新
   * @param {*} params 
   */
  async update(params) {
    const res = await editSingGood(this.state.editId, params)
    if (res.code === 0) {
      message.success('更新成功！')
      this.props.history.push({pathname:'/commodity/manage', query: {platformType: params.platformType}});
    }
    this.setState({
      isEdit: false
    })
  }

  /**
   * 查询单个详情 （编辑时候）
   * @param {*} id 
   */
  async getGood(id) {
    const res = await getSingGood(id)
    const data = res.data
    if (data) {
      let editInit = {
        virtualCurrencyType: data.virtualCurrencyType.value,
        platformType: data.platformType.value,
        title: data.title,
        display: data.display,
        amount: data.amount,
        price: Number(data.price) / 100,
        icon: data.icon,
        isTimeLimited: data.isTimeLimited,
        identifier: data.identifier
      }
      if (data.isTimeLimited) {
        Object.assign(editInit, {
          // startTime: moment(new Date(data.startTime), 'YYYY-MM-DD HH:mm:ss'),
          // endTime: moment(new Date(data.endTime), 'YYYY-MM-DD HH:mm:ss')
          time: [moment(new Date(data.startTime), 'YYYY-MM-DD HH:mm:ss'), moment(new Date(data.endTime), 'YYYY-MM-DD HH:mm:ss')]
        })
      }
      this.formRef.current.setFieldsValue(editInit)
      
      this.setState({
        iconUrl: data.icon,
        checkNick: data.isTimeLimited,
        isDown: data.status
      })
    }
  }
  componentDidMount () {
    // 如果有id则是编辑时候的状态
    const id = this.props.location.search.split('=')[1];
    if (id) {
      this.setState({
        isEdit: true,
        editId: id
      })
      this.getGood(id)
    }
  }
  
  //如果有异步设置state值的情况，在组件销毁时清除所有的state状态
  componentWillUnmount() {
    this.setState = (state, callback) => {
        return
    }
  }

  handleChangeDisplay = e => {
    this.setState({
      displayNum: e.target.value.length
    })
  }

  render () {
    return (
      <>
      {
        this.state.isEdit
        ?
        <Table className="commodity-table" columns={this.columns} dataSource={this.state.data} rowKey="id" 
        pagination = {false}
        />
        :
        null
      }
      <Form
      ref = {this.formRef}
      name="commodity"
      className="commodity-form"
      onFinish={this.handleOk}
      onFinishFailed={this.handleError}
      >
        <Row>
          <Col span={12} style={{ paddingRight: 71 }}>
            <Form.Item 
            label="商品种类"
            name="virtualCurrencyType"
            rules={[{ required: true, message: '请选择商品种类!' }]}
            >
              <Select disabled={this.state.isDown}>
                <Option value={2}>今币</Option>
              </Select>
            </Form.Item>
            <Form.Item label="所属平台" name="platformType">
              <Radio.Group
              disabled={this.state.isDown}
              >
                <Radio value={1}>IOS</Radio>
                <Radio value={2}>Android</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="商品ID" name="identifier"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item 
              label="商品名称"
              name="title"
              extra="*标题字数不超过36个字"
              rules={[{ required: true, message: '标题不能为空!' }]}
              >
                <Input placeholder="请输入" maxLength={36} disabled={this.state.isDown} />
            </Form.Item>
            <Form.Item
            label="商品描述" name="display"
            extra={<div className="dis-flex-between"><span>*描述字数不超过60个字</span><span>已输入{this.state.displayNum}字</span></div> }
          >
              <TextArea placeholder="请输入" rows={4} maxLength={60} disabled={this.state.isDown} onChange={this.handleChangeDisplay} />
            </Form.Item>
          </Col>
          <Col span={12} style={{paddingLeft: 71}}>
            <Form.Item label="商品icon" name="icon" extra="*icon建议尺寸1024*1024（1：1）">
              <UploadImage defaultImg={this.state.iconUrl} styles={{width: 98, height: 98, borderRadius: '6px'}} url="https://dev.jinqiulive.com/front-tools/oss/token?type=video" getImgUrl={this.handleIcon} isCoverImg={true} />
            </Form.Item>
            {/* <Form.Item 
                label="商品价值"
                name="amount"
                extra="*数字上限9999"
                rules={[{ required: true, message: '请选择商品价值!' }]}
                >
                  <Input suffix="今币" style={{display: 'flex'}} disabled={this.state.isDown}/>
            </Form.Item> */}
              <LimitFormItem
              label="商品价值"
              name="amount"
              extra="*数字上限9999"
              regType="money"
              message = '请输入商品价值!'
              maxValue={9999}
              suffix="今币"
              disabled={this.state.isDown}
             />
            {/* <Form.Item 
                label="现金价值"
                name="price"
                extra="*数字上限9999"
                rules={[{ required: true, message: '请选择现金价值!' }]}
                >
                   <Input suffix="元" style={{display: 'flex'}} disabled={this.state.isDown} />
            </Form.Item> */}
            <LimitFormItem
              label="现金价值"
              name="price"
              extra="*数字上限9999"
              regType="money"
              suffix="元"
              message = '请输入现金价值!'
              disabled={this.state.isDown}
              maxValue={9999}
             />
            {/* <Form.Item 
              label="商品库存"
              name="number"
              extra="*数字上限9999"
             // rules={[{ required: true, message: '商品库存不能为空!' }]}
              >
                <InputNumber  min={1} max={9999}/>
            </Form.Item> */}
            {/* <LimitFormItem
              label="商品库存"
              name="number"
              extra="*数字上限9999"
              regType="number"
              message = '商品库存不能为空!'
              maxValue={9999}
             /> */}
            <Form.Item 
              name="isTimeLimited"
              >
              <Checkbox
                disabled={this.state.isDown}
                checked={this.state.checkNick}
                onChange={this.onCheckboxChange}
                >
                即时商品
              </Checkbox>
            </Form.Item>
            {
              this.state.checkNick
              ?
              // <>
              //   <Form.Item name="date-time-picker" 
              //   label="开始日期" 
              //   name="startTime"
              //   rules={[{  type: 'object', required: this.state.checkNick, message: '您勾选了即时商品，该内容不能为空!' }]}

              //   >
              //   <DatePicker format="YYYY-MM-DD HH:mm:ss" disabled={this.state.isDown}/>
              // </Form.Item>
              // <Form.Item name="date-time-picker" 
              //   label="结束日期"
              //   name="endTime" 
              //   rules={[{  type: 'object', required: this.state.checkNick, message: '您勾选了即时商品，该内容不能为空!' }]}
              //   >
              //   <DatePicker format="YYYY-MM-DD HH:mm:ss" disabled={this.state.isDown}/>
              // </Form.Item>
              // </>
              <Form.Item
                label="选择日期" 
                name="time"
                rules={[{  type: 'array', required: this.state.checkNick, message: '您勾选了即时商品，该内容不能为空!' }]}

                >
                <RangePicker format="YYYY-MM-DD HH:mm:ss" disabled={this.state.isDown}/>
              </Form.Item>
              :
              null
            }
          </Col>
          <Col span={24}>
            <Form.Item {...tailLayout} colon={false}>
              {
                !this.state.isEdit
                ?
                <Button type="primary" htmlType="submit">
                确认发布
                </Button>
                :
                <Button type="primary" htmlType="submit">
                发布更新
                </Button>
              }
            </Form.Item>
          </Col>
        </Row>
      </Form>
      </>
    )
  }
}

export default Commodity;