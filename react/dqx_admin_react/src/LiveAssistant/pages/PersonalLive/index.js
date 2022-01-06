import React from 'react';
import { Form, Button, Input, message, Select, Row, Col, Radio, DatePicker, Modal } from 'antd';
import { getAddress, getRoom, getChannel, getPullAddress, getPullStatus, liveStop, liveBegin, livePause, liveRecover, addBlackList, delBlackList } from '../../api/live';
import 'video.js/dist/video-js.css'
import ic_bg from "../../img/tv.png";
import 'videojs-flash'
import videojs from 'video.js'
import Chat from './chat';

import './style.scss';

const { Option } = Select;

const url = [
  {
    url: "rtmp://58.200.131.2:1935/livetv/hunantv",
    name: "湖南卫视"
  },
  {
    url: "rtmp://202.69.69.180:443/webcast/bshdlive-pc",
    name: "香港财经"
  }
]

class PersonalLive extends React.Component {
  constructor(props) {
    super(props)
    // 绑定新增表单
    this.formRef = React.createRef();
    this.state = {
      roomNumber: '',
      id: '',
      blackList: [],
      isRight: true,
      channelList: [],
      url: '',
      roomStatus: 0,
      StatusTxt: '开播',
      statusValue: 0,
      permnition: '',
      pullState: 0,
      isOpen: false
    }
  }

  /**
   * 加载
   */
  async componentDidMount() {
    let { data } = await getRoom()
    let channelData = await getChannel()
    let status = await getPullStatus(data.id)
    this.formRef.current.setFieldsValue(Object.assign(data, { type: data.channel.id }))
    this.setState({
      roomNumber: data.roomNumber,
      blackList: data.blackList,
      channelList: channelData.data,
      id: data.id,
      roomStatus: status.data.value,
      statusValue: data.streamer.status.value,
      permnition: data.permnition

    })
    if (status.data.value === 1) {
      this.setVideo(await getPullAddress(data.id))
    }
  }
  handleClick(item) {
    if (item.name === this.state.nowPlay) {
      return
    }
    this.setState({
      nowPlay: item.name
    })
    this.player.pause();
    this.player.src(item.url);
    this.player.load();
    this.player.play();
  }

  /**
   * 流初始化
   */

  setVideo(pullAddress) {
    const videoJsOptions = {
      autoplay: true,
      controls: true,
      sources: [{
        // src: 'rtmp://58.200.131.2:1935/livetv/hunantv',
        // 流的清晰度
        // pullAddress.data.originPullUrl || 
        src: pullAddress ? pullAddress.data.highPullUrl || pullAddress.data.originPullUrl: '',
        type: 'rtmp/flv'
      }]
    }
    this.player = videojs('my-video', videoJsOptions, function onPlayerReady() { //(id或者refs获取节点，options，回调函数)
      videojs.log('Your player is ready!');
      // In this context, `this` is the player that was created by Video.js.
      this.play();
      // How about an event listener?
      this.on('ended', function () {
        videojs.log('Awww...over so soon?!');
      });
    });
  }

  /**
   * 视频流相关操作-刷新
   * @param {*} data 
   */

  async refresh(){
    let status = await getPullStatus(this.state.id);
    this.setState({
      roomStatus: status.data.value,
    })
    if (status.data.value === 1) {
      this.setVideo(await getPullAddress(this.state.id))
    }
  }



  copy(data) {
    let url = data;
    let oInput = document.createElement("input");
    oInput.value = url;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象;
    console.log(oInput.value);
    document.execCommand("Copy"); // 执行浏览器复制命令
    message.info('已复制')
    oInput.remove();
  }


  /**
   * 开播
   */
  liveBeginOk = () => {
    if (this.state.statusValue === 1) {
      liveStop().then(_ => {
        this.setState({
          StatusTxt: '开播',
          statusValue: 0
        })
      })
    } else {
      liveBegin().then(_ => {
        this.setState({
          StatusTxt: '下播',
          statusValue: 1
        })
      })
    }
  }


  /**
   * 暂停
   */
  liveStopOk = () => {
    if (this.state.statusValue === 1) {
      livePause().then(_ => {
        this.setState({
          statusValue: 2
        })
      })
    } else {
      liveRecover().then(_ => {
        this.setState({
          statusValue: 1
        })
      })
    }
  }
  /**
   * 获取推流地址
   */
  async getAddressFn() {
    let { data } = await getAddress(this.state.id)
    this.setState({
      url: data
    })
    // console.log(data) 

    this.formRef.current.setFieldsValue({
      address: data
    })
    this.copy(data)
  }

  /**
   * 点击其他地方关闭右击弹窗
   */
  setRightClick() {
    this.setState({
      isRight: !this.state.isRight
    })
  }


  render() {
    return (
      <div className="person-live" onClick={this.setRightClick.bind(this)}>
        <Form
          ref={this.formRef}
          name="form"
          className="person-live-form"
        >
          <Row>
            <Col span={16}>
              <Form.Item
                label="推流地址"
              >
                <Row gutter={8}>
                  <Col span={16}>
                    <Form.Item
                      name="address"
                      noStyle
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Button type="primary" onClick={this.getAddressFn.bind(this)}>获取</Button>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item>
                <div className="person-live-video">
                <video style={{ width: "784px", height: "440px", marginLeft: '35px', marginTop: '20px', marginBottom: '20px', borderRadius: '20px' }} id="my-video" className="video-js vjs-default-skin">
                      </video>
                  {
                    this.state.roomStatus === 1 ?
                      null
                      : <div className="person-live-video-trailer">{this.state.permnition}</div>
                  }
                  <div className="opt-video">
                    <span className={`${this.state.statusValue === 1 || this.state.statusValue === 2 ? 'offline' : 'open'}`} onClick={this.liveBeginOk}></span>
                    <div>
                      {
                        this.state.statusValue === 1 || this.state.statusValue === 2 ?
                          <span className={`${this.state.statusValue === 1 ? 'stop' : 'rebroadcast'}`} onClick={this.liveStopOk}></span>
                          : null}
                      <span className="reFresh" onClick={this.refresh.bind(this)}></span>
                    </div>
                  </div>
                </div>
              </Form.Item>
              <Form.Item
                name="topic"
                label="直播主题"
              >
                <Input maxLength={30} disabled />
              </Form.Item>
              <Form.Item
                name="type" label="直播类型">
                <Select
                  disabled
                >
                  {
                    this.state.channelList.map((res, index) => {
                      return <Option value={res.id} key={index}>{res.name}</Option>
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item
                name="notice"
                label="房间公告"
              >
                <Input.TextArea disabled autoSize={{ minRows: 3, maxRows: 5 }} maxLength={60} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Chat blackList={this.state.blackList} id={this.state.id} isRight={this.state.isRight}></Chat>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

export default PersonalLive;
