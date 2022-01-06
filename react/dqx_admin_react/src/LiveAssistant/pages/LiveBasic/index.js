import React from 'react';
import { Form, Button, Input, message, Select, Row, Col, Radio, DatePicker, Modal } from 'antd';
import { getRoom, putRoom, getChannel, liveStop, liveBegin, addBlackList } from '../../api/live';
import moment from 'moment'

import RoomManageModal from '../../component/RoomManageModal';
import UploadImage from '../../../component/UploadImage';
import Reservation from "@livepages/Reserve/reservation";

import './style.scss';

const { Option } = Select;
class LiveBasic extends React.Component {
  constructor(props) {
    super(props)
    // 绑定新增表单
    this.formRef = React.createRef();
    this.state = {
      imgUrl: '',
      roomManagerList: [],
      isShowModal: false,
      channelList: [],
      roomData: {
        addNum: 0,
        blackList: [],
        createTime: null,
        id: 0,
        isPrem: false,
        logo: null,
        managers: [],
        name: null,
        notice: null,
        onLineNum: 0,
        permnition: null,
        repeatTimes: null,
        roomNumber: 0,
        roomUrl: null,
        startTime: null,
        streamer: {
          avatar: null,
          id: "",
          isDelete: false,
          isRecommend: false,
          mobile: null,
          nickName: null,
          operaTime: null,
          status: { value: 0, display: "休息中" },
          updateTime: 1590468618862
        },
        topic: null,
        type: null,
        updateTime: null,
        wangsuChannel: "",
      },
      isShowRaceModal: false,
      matchId: 0,
      category: 0
    }
  }
  /**
   * 加载
   */
  async componentDidMount() {
    let { data } = await getRoom()
    let channelData = await getChannel()
    data.startTime = moment(new Date(data.startTime), 'YYYY-MM-DD HH:mm:ss')
    if(data.channel){
      Object.assign(data,{type:data.channel.id})
    }
    if (data.matchVo) {
      Object.assign(data,{competitionName:`${data.matchVo.competition || ''} ${data.matchVo.title}`})
    }
    Object.assign(data, {roomUrl: data.h5Url})
    this.formRef.current.setFieldsValue(data)
    this.setState({
      roomData: data,
      matchId: data.matchVo ? data.matchVo.id : 0,
      channelList: channelData.data.filter(item => item.isAll === false),
      imgUrl: data.logo
    })
  }

  /**
 * 获取图片地址
 * @param {*} url 
 */
  handleImg = url => {
    this.formRef.current.setFieldsValue({
      logo: url
    })
    this.setState({
      imgUrl: url
    })
  }

  /**
   * 添加房管弹窗
   */
  handleAddRoomM = () => {
    this.setState({
      isShowModal: true
    })
  }

  /**
   * 取消添加房管弹窗
   */
  handleCancel = () => {
    this.setState({
      isShowModal: false
    })
  }

  /**
   * 添加房管回调
   */
  addManager = (e) => {
    let ids = []
    this.state.roomData.managers.map(res => {
      ids.push(res.userId || res.id)
    })
    if (ids.includes(e.id)) {
      message.info('请勿重复添加')
      return
    }
    let data = this.state.roomData;
    data.managers.push(e)
    this.setState({
      data,
      isShowModal: false
    })

  }

  /**
   * 保存直播间设置
   */
  subChange = () => {
    let ids = []
    this.state.roomData.managers.map(res => {
      ids.push(res.userId || res.id)
    })
    let items =  this.formRef.current.getFieldsValue()
    let data = {
      logo: items.logo,
      name:items.name,
      isPrem: items.isPrem,
      permnition: items.permnition,
      repeatTimes: items.repeatTimes,
      startTime:  Date.parse(items.startTime),
      roomUrl: items.roomUrl,
      topic: items.topic,
      channelId: items.type,
      notice: items.notice,
      managerUsers: ids,
      category: this.state.category,
      matchId: this.state.matchId
    }
    if (items.competitionName == null) {
      message.info('请选择直播间比赛')
      return
    }
    putRoom(data).then(res => {
      message.info('保存成功')
    })
  }

  /**
   * 删除房管
   */
  delMan = (val) => {
    let data = this.state.roomData
    data.managers.splice(val,1)
    this.setState({
      data
    })
  }

  /**
   * 进入直播间
   */
  handleToLive = () => {
    this.props.history.push('/live/personal')
  }

  /**
   * 打开比赛弹出层
   */
  modalRace =() => {
    this.setState({
      isShowRaceModal: true
    })
  }

  /**
   * 取消比赛弹出层
   */
  handleCancelRace = () => {
    this.setState({
      isShowRaceModal: false
    })
  }

  /**
   * 直播间比赛值
   */
  handleRace = (item) => {
    const title = `${item.competitionName || ''} ${item.homeName} VS ${item.awayName}`
    this.formRef.current.setFieldsValue({competitionName: title})
    this.setState({
      isShowRaceModal: false,
      matchId: item.matchId,
      category: item.category
    })
  }

  //如果有异步设置state值的情况，在组件销毁时清除所有的state状态
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return
    }
  }

  render() {
    return (
      <div className="live-basic">
        <Form
          ref={this.formRef}
          name="form"
          className="live-basic-form"
          onFinish={this.handleOk}
        >
          <Row>
            <Col span={12}>
              <Form.Item
                label="房间ID"
                extra="（当前仅支持手机账号）"
              >
                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item
                      name="roomNumber"
                      noStyle
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Button type="primary" onClick={this.handleToLive}>我的直播间</Button>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item
                name="topic"
                label="直播主题"
                style={{ width: 560 }}
              >
                <Input maxLength={30} />
              </Form.Item>
              <Form.Item
                name="type" label="直播频道"
                style={{ width: 560 }}
                >
                <Select
                >
                  {
                    this.state.channelList.map((res, index) => {
                    return <Option value={res.id} key={index}>{res.name}</Option>
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item
                name="competitionName"
                label="直播间比赛"
                style={{ width: 560 }}
              >
                <Input onClick={this.modalRace} />
              </Form.Item>
              <Form.Item
                name="logo"
                label="直播间封面"
              >
                <UploadImage defaultImg={this.state.imgUrl} isShowLoading={false} styles={{ width: 400, height: 200, border: '1px solid' }} url="https://dev.jinqiulive.com/front-tools/oss/token?type=video" getImgUrl={this.handleImg} text='编辑图像' />
              </Form.Item>
              <Form.Item
                name="isPrem"
                label="直播预告"
              >
                <Radio.Group>
                  <Radio value={true}>开启</Radio>
                  <Radio value={false}>关闭</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name="permnition"
                label=" "
                colon={false}
              >
                <Input style={{ width: 540 }} maxLength={15} />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
                name="repeatTimes"
                label="重复次数"
              >
                <Radio.Group>
                  <Radio value={0}>单次</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name="startTime"
                label="开始时间"
              >
                <DatePicker format="YYYY-MM-DD HH:mm:ss" />
              </Form.Item>
              <Form.Item
                name="roomUrl"
                label="直播间地址"
              >
                <Input disabled style={{ width: 540 }} />
              </Form.Item>
              <Form.Item
                name="notice"
                label="房间公告"
              >
                <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} maxLength={60} />
              </Form.Item>
              <Form.Item
                label="房间管理"
              >
                <Button type="primary" style={{ float: "right" }} onClick={this.handleAddRoomM}>添加</Button>
              </Form.Item>
              <Form.Item
                colon={false}
              >
                {
                  this.state.roomData.managers.length > 0 ?
                    this.state.roomData.managers.map((res, index) => {
                      return (
                        <div className="roomM-list" key={index}>
                          {/* <i className="roomM-list-avator">
                            <img src={res.avatar} alt="头像" />
                          </i> */}
                          <span className="roomM-list-name">{res.nickname || res.nickName}</span>
                          <Button style={{ float: "right" }} type="link" danger onClick={() => this.delMan(index)}>删除</Button>
                        </div>
                      )
                    })
                    : <span className="man-non">暂无房管</span>
                }
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            className="live-basic-form-button"
          >
            <Button size="large" type="primary" htmlType="submit" onClick={this.subChange}>
              保存设置
              </Button>
          </Form.Item>
        </Form>
        <Modal
          title="添加房管"
          footer={null}
          visible={this.state.isShowModal}
          onCancel={this.handleCancel}
        >
          <RoomManageModal managers={this.state.roomData.managers} addMan={this.addManager} />
        </Modal>
        <Modal
          width="50%"
          title="我预约的比赛"
          footer={null}
          visible={this.state.isShowRaceModal}
          onCancel={this.handleCancelRace}
        >
          <Reservation top="true" selectedValue={this.handleRace} />
        </Modal>
      </div>
    )
  }
}

export default LiveBasic;
