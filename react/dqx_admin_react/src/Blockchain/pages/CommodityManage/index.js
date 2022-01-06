import React from 'react';
import {  Modal, Collapse, message } from 'antd';

import DragCard from '../../component/DragCard';
import { getGoods, downSingGood, upSingGood, delSingGood, moveSingGood } from '@bcapi/deposit';
import './style.scss';

const { Panel } = Collapse;

class CommodityManage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // iosList: [],
      // andList: [],
      // iosDownList: [],
      // andDownList: [],
      obj: {},
      firstIndex: null
    }
  }

  callback = (key) => {
    console.log(key)
  }

  /**
   * 获取列表
   */
  async getList() {
    const res = await getGoods();
    if (res.code === 0) {
      const obj = res.data
      this.setState({
        obj: obj,
        //  iosList: obj['苹果'] ? obj['苹果'].filter(item => item.status):[],
        //  andList: obj['安卓'] ? obj['安卓'].filter(item => item.status):[],
        //  iosDownList: obj['苹果'] ? obj['苹果'].filter(item => !item.status):[],
        //  andDownList: obj['安卓'] ? obj['安卓'].filter(item => !item.status):[]
        firstIndex: this.props.location.query ? this.props.location.query.platformType === 1? '苹果': '安卓' :Object.keys(obj)[0]
      })
    }
  }

  /**
   * 返回平台显示
   */
  platformText = type => {
    switch(type) {
      case 1: return '苹果' ;break;
      case 2: return '安卓'; break;
      case 3: return 'web'; break;
    }
  }

  /**
   * 下架弹窗
   */
  handleDown = (data) => {
    let plateText = this.platformText(data.platformType.value)
    let arr = this.state.obj[data.platformType.display].filter(item => item.status)
    if (arr.length === 1) {
      const modal = Modal.confirm()
      modal.update({
        title: '下架警告',
        content: `这是${plateText}区最后一个在线的商品确定要继续进行下架处理吗？`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          downSingGood(data.id).then(_ => {
            message.info('下架成功');
            this.getList();
           })
        },
        onCancel() {
        },
      })
      return
    }

    /**
     * 下架的如果是限时商品（主动下架时间不在下架时间范围内），做警告提示
     */
    let nowTime = new Date().getTime()
    if (data.isTimeLimited && nowTime < data.endTime) {
      const modal = Modal.confirm()
      modal.update({
        title: '限时商品',
        content: '这是限时商品，还未到下架时间是否直接下架',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          downSingGood(data.id).then(_ => {
            message.info('下架成功');
            this.getList();
          })
        },
        onCancel() {
        },
      })
      
      return
    }

    const modal = Modal.confirm()
      modal.update({
        title: '再次确认',
        content: '下架后移动端将不再显示当前商品',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
         downSingGood(data.id).then(_ => {
          message.info('下架成功');
          this.getList();
         })
        },
        onCancel() {
        },
      })
  }

  /**
   * 上架弹窗
   */
  handleUp = (data) => {
    /**
     * 上架的如果是限时商品（主动上架时间不在上架时间范围内），做警告提示
     */
    let nowTime = new Date().getTime()
    if (data.isTimeLimited && nowTime < data.startTime) {
      const modal = Modal.confirm()
      modal.update({
        title: '限时商品',
        content: '这是限时商品，还未到上架时间是否直接上架',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          upSingGood(data.id).then(_ => {
            message.info('上架成功');
            this.getList();
          })
        },
        onCancel() {
        },
      })
      
      return
    }
    const modal = Modal.confirm()
      modal.update({
        title: '再次确认',
        content: '请再次确认您将要上架的虚拟商品已设置正确',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          upSingGood(data.id).then(_ => {
          message.info('上架成功');
          this.getList();
         })
        },
        onCancel() {
        },
      })
  }

  /**
   * 删除弹窗
   */
  handleDele = (data) => {
    const modal = Modal.confirm()
      modal.update({
        title: '删除警告',
        content: '删除后当前今币将被移动到虚拟币回收站确定要继续操作吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          delSingGood(data.id).then(_ => {
          message.info('删除成功');
          this.getList();
         })
        },
        onCancel() {
        },
      })
  }
  
  /**
   * 查看详细
   */
  getDetail = (data) => {
    this.props.history.push(`/commodity/push?id=${data.id}`)
  }
  
  /**
   * 移动
   */
  getMove = (id, to, from) => {
    moveSingGood(id, {location: to + 1}).then(_ => {
      message.success('移动成功！')
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

  render () {
    let items = []
    for (let key in  this.state.obj) {
      items.push(
       <Panel header={`${key}区`} key={key}>
        <DragCard
        data= {this.state.obj[key].filter(item => item.status)}
        getDown={this.handleDown}
        getDetail={this.getDetail}
        getMove = {this.getMove} 
        tag={true}
        />
        <DragCard
        drage={false}
        down={false}
        up={true}
        dele={true}
        data= {this.state.obj[key].filter(item => !item.status)}
        getUp={this.handleUp}
        getDele={this.handleDele}
        getDetail={this.getDetail} />
       </Panel>
       )
    }

    return (
      items.length>0
      ?
      <Collapse defaultActiveKey={[this.state.firstIndex]} className="commodity-list" onChange={this.callback}>
        {
         items
        }
        {/* <Panel header="Andorid" key="2">
          <DragCard
          data= {this.state.andList}
          getDown={this.handleDown}
          getDetail={this.getDetail}
          getMove = {this.getMove} 
          />
          <DragCard
          drage={false}
          down={false}
          up={true}
          dele={true}
          data= {this.state.andDownList}
          getUp={this.handleUp}
          getDele={this.handleDele}
          getDetail={this.getDetail} />
       </Panel>
       <Panel header="IOS" key="1">
          <DragCard 
          data = {this.state.iosList} 
          getDown={this.handleDown} 
          getDetail={this.getDetail}
          getMove = {this.getMove}
          />
          <DragCard
          drage={false}
          down={false}
          up={true}
          dele={true}
          data= {this.state.iosDownList}
          getUp={this.handleUp}
          getDele={this.handleDele}
          getDetail={this.getDetail}/>
       </Panel> */}
     </Collapse>
      :
      null
    )
  }
}

export default CommodityManage;
