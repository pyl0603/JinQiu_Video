import React from 'react';
import { Modal, Collapse, message } from 'antd';

import DragCard from '../../component/DragCard';
import { getDelGoods, restoreSingGood } from '@bcapi/deposit';

const { Panel } = Collapse;

class CommodityRecycle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // iosList: [],
      // andList: []
      obj: {},
      firstIndex: null
    }
  }
  handleReduction = (data) => {
    const modal = Modal.confirm()
      modal.update({
        content: '确认还原?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          restoreSingGood(data.id).then(_ => {
            message.info('还原成功');
            this.props.history.push('/commodity/manage');
           })
        },
        onCancel() {
        },
      })
  }

  getDetail = (data) => {
    this.props.history.push(`/commodity/push?id=${data.id}`)
	}

  async getList() {
    const res = await getDelGoods();
    if (res.code === 0) {
      const obj = res.data
      if (Object.keys(obj).length === 0) {
        return
      } else {
        this.setState({
          // iosList: obj['苹果'],
          // andList:  obj['安卓']
          obj: obj,
          firstIndex: Object.keys(obj)[0]
       })
      }
    }
  }

  componentDidMount () {
    this.getList()
  }
  
  render () {
    let items = []
    for (let key in  this.state.obj) {
      items.push(
       <Panel header={`${key}区`} key={key}>
        <DragCard drage={false} down={false} reduction={true}  data = {this.state.obj[key]} getReduction={this.handleReduction}/>
       </Panel>
       )
    }
    return (
      items.length> 0
      ?
      <Collapse defaultActiveKey={[this.state.firstIndex]} className="commodity-list" onChange={this.callback}>
        {
          items
        }
     </Collapse>
     :
     null
    )
  }
}

export default CommodityRecycle;
