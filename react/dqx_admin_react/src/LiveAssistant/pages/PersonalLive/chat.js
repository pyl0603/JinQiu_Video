import React from 'react';
import Cookies from "js-cookie";
import openSocket from "socket.io-client";
import store from '../../redux/store';
import { Row, Col, Input, Button, message } from 'antd';
import { getAddress, getRoom, liveStop, liveBegin, addBlackList, delBlackList, getBlackList } from '../../api/live'
import './style.scss'

const { TextArea } = Input;

const token = Cookies.get('token')
// let socket = openSocket(`http://socket.jinqiulive.com:9999?client=admin&token=${token}`)

let socket = openSocket(`http://192.168.1.201:9999?client=admin&token=${token}`)

class Chat extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.id)
    this.root = React.createRef();
    this.state = {
      message: [],
      content: '',
      type: 1,
      opt: false,
      title: '',
      isShow: true,
      userId: '',
      id: 0,
      ids: 0,
      blacklist:[],
      onLineNum: 0
      // blacklist: [{ name: 'xxixi', type: '禁言' }, { name: 'xxixi', type: '禁言' }, { name: 'xxixi', type: '禁言' }, { name: 'xxixi', type: '禁言' }]
    }

  }



  /**
 * 点击切换头部
 * 1-聊天室
 * 2-小黑屋
 */
  changeType = (e) => {
    if(e === 2){
      this.blackLists()
    }
    this.setState({
      type: e
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ids: nextProps.id }, () => {
      console.log(this.state.ids, 1)
    })
    if (this.props.isRight != nextProps.isRight) {
      this.setState({
        isShow: true,
      })
    }
  }


  componentWillUnmount() {
    this.leave()
  }
  async componentDidMount() {
    let { data } = await getRoom();
    this.setState({
      id: data.id,
      onLineNum: data.onLineNum
    })
    this.socketCon(data.id)
  }
  socketCon(val) {
    // socket = openSocket(`http://socket.jinqiulive.com:9999?client=admin&token=${Cookies.get('token')}`)

    socket = openSocket(`http://192.168.1.201:9999?client=admin&token=${Cookies.get('token')}`)
    socket.on("connect", () => {
      console.log("页面挂载")
      let chMsg = { channel: val };
      // 加入频道
      setTimeout(() => {
        socket.emit("dqx.live.channel.join", chMsg, data => {
          console.log(data,chMsg, "加入频道");
        });
      }, 100)

      // 接收聊天
      socket.on("dqx.live.receive", msg => {
        let message = this.state.message;
        message.push(msg)
        this.setState({
          message
        })
        if (msg.type.value !== 2) {
          const ele = this.refs.chatNode
          if (ele.scrollHeight > ele.clientHeight) {
            //设置滚动条到最底部
            ele.scrollTop = ele.scrollHeight;
          }
        }
      });
      //触发客户端注册的自定义事件
      socket.on("error", function (message) {
        console.log(message);
      });
    });
  }


  /**
   * 发送聊天
   */
  send() {
    // let socket = openSocket(`http://192.168.1.201:9999?client=admin&token=${Cookies.get('token')}`)
    if (this.state.content.replace(/(^\s*)|(\s*$)/g, "").length === '') {
      message.info("请输入内容")
      return
    }
    let msg = { channel: this.state.id, content: this.state.content };
    socket.emit("dqx.live.send", msg, (data) => {
      console.log(data)
      this.setState({
        content: ''
      })
    });
  }

  /**
   * 聊天框
   */
  contInput = (event) => {
    this.setState({
      content: event.target.value
    })
  }

  leave() {
    // let socket = openSocket(`http://192.168.1.201:9999?client=admin&token=${Cookies.get('token')}`)
    let msg = { channel: this.state.id };
    socket.emit("dqx.live.channel.leave", msg, (data) => {
      console.log(data, "离开直播间");
    });
  }

  /**
   * 
   * @param {*} val 
   */
  delBlackList = (val) => {
    delBlackList(this.props.id, val.userId).then(_ => {
      message.info('操作成功')
    })
  }

  /**
   * 加入黑名单
   * @param {*} val 
   */
  addBlackLists(val) {
    addBlackList(this.props.id, this.state.userId, val).then(_ => {
      message.info('操作成功')
      this.setState({
        isShow: true
      })
    })
  }

  /**
   * 获取黑名单列表
   */
  blackLists() {
    getBlackList(this.state.id).then(res => {
      this.setState({
        blacklist: res.data
      })
    })
  }
  /**
   * 右击事件
   */
  setUser(e, val) {
    val.preventDefault()
    if (!e.user.id) {
      return
    }
    this.setState({
      isShow: false,
      userId: e.user.id
    })
    console.log(e)
    const clickX = val.clientX;
    const clickY = val.clientY;               //事件发生时鼠标的Y坐标
    const screenW = window.innerWidth;   //文档显示区的宽度
    const screenH = window.innerHeight;
    const rootW = this.refs.root.offsetWidth;     //右键菜单本身元素的宽度
    const rootH = this.refs.root.offsetHeight;

    const right = (screenW - clickX) > rootW;
    const left = !right;
    const top = (screenH - clickY) > rootH;
    const bottom = !top;
    if (right) {
      console.log(1)
      this.refs.root.style.left = `calc(${clickX - 30}px - 65vw)`;
    }

    if (left) {
      console.log(2)
      this.refs.root.style.left = `${clickX - rootW - 15}px`;
    }

    if (top) {
      console.log(3)
      this.refs.root.style.top = `${clickY + 15 - 120}px`;
    }

    if (bottom) {
      console.log(4)
      this.refs.root.style.top = `${clickY - rootH - 15}px`;
    }
    this.setState({
      opt: true,
      title: e.user.nickname
    })
  }

  render() {
    return (
      <div>
        <Row className="header-type antd-cp">
          <Col span={12} className={{ on: this.state.type === 1 }} onClick={() => this.changeType(1)}>聊天室(热度：{this.state.onLineNum})</Col>
          <Col span={12} className={{ on: this.state.type === 2 }} onClick={() => this.changeType(2)}>小黑屋</Col>
        </Row>  
        <div className="chat-top">

        </div>
        <div className="chat-area" ref='chatNode'>
          {
            this.state.type === 1 ?
              this.state.message.map((res, index) => {
                return <span className="msg-items antd-cp" key={index} onContextMenu={this.setUser.bind(this, res)}>

                  {
                    res.type.value === 0 ? <i className={`${res.userType.value === 0 ? 'zhubo' : ''} ${res.userType.value === 1 ? 'fangguan' : ''} ${res.userType.value === 2 ? 'yonghu' : ''}`}>【{res.userType.display}】</i> : null
                  }
                  {/* {
                    res.type.value === 0 ? <em>{res.user.nickname}：</em> : null
                  } */}
                  <em>{res.user.nickname}：</em>
                  <em className={`${res.type.value !== 0 ? 'tips' : ''}`}>
                    {res.content}
                  </em>
                </span>
              })
              :
              
              this.state.blacklist.map((res, index) => {
                return <div className="black-list" key={index}><em>{res.nickName}</em><em>{res.status.display}</em><Button onClick={() => this.delBlackList(res)}>解禁</Button></div>
              })
          }
          <div className="user-opt contextMenu" ref='root' className={this.state.isShow ? 'noneTab' : "user-opt contextMenu"}>
            <span className="user-name antd-cp" onClick={this.addBlackLists.bind(this, 0)}>禁言用户 --{this.state.title}</span>
            <span className="user-name antd-cp" onClick={this.addBlackLists.bind(this, 1)}>拉黑用户 --{this.state.title}</span>
          </div>
        </div>
        <Row className="chat-cont">
          <TextArea value={this.state.content} onChange={this.contInput} onPressEnter={this.send.bind(this)} maxLength={30}></TextArea>
          <Button onClick={this.send.bind(this)}>发送</Button>
          {/* <Button onClick={this.leave.bind(this)}>断开</Button> */}
        </Row>
      </div>
    )
  }
}

export default Chat;