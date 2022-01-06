import React from 'react';
import { Input, Button, Table, Modal, message } from 'antd';
import { getAds, optAdv } from '@api/createAd.js'
import { getAdvSingleDetails } from '@api/advGroup.js'

import ModuleSelection from '@component/ModuleSelection';
import Phone from '@component/Phone';

class AdTypes extends React.Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
    data: [],
    pageId:null,
    visible: false,
    adTitle: '',
    preview: []
  };

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  };

  setAgeSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'age',
      },
    });
  };

  getPageValue = (obj) => {
    console.log(obj)
    this.setState({
      pageId: obj.thirdLevelModuleId
    }, () => {
      this.getList()
    })
  }

  /**
   * 获取列表
   */
  getList(){
    if (this.state.pageId) {
      getAds(this.state.pageId).then(res => {
        this.setState({
          data: res.data
        })
      })
    }
  }

  /**
   * 
   */
  async listOpt(e,val){
    optAdv(this.state.pageId,e,{opt: val}).then(_ => {
      message.info('操作成功');
      this.getList();
    })
  }

  componentDidMount(){
   // this.getList();
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
        const isobj = arr.find((temp, i) => i === id);
        if (isobj === undefined) {
          arr.push(obj);
        } else {
          isobj.url = obj.url
        }
      })
      this.setState({
        adTitle: data.title == null ? '': data.title,
        preview: arr,
        visible: true
      })
    })
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

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: '排序',
        align: 'center',
        render: (items,text,index) => (
          <span>{++index}</span>
        )
      },
      {
        title: '标题',
        dataIndex: 'title',
        align: 'center',
        key: 'title'
      },
      {
        title: '链接',
        dataIndex: 'resUrl',
        align: 'center',
        key: 'resUrl'
      },
      {
        title: '广告组名称',
        dataIndex: 'groupName',
        align: 'center',
        key: 'groupName'
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
        filteredValue: filteredInfo.clickTimes || null,
        onFilter: (value, record) => record.clickTimes.includes(value),
        sorter: (a, b) => a.clickTimes.length - b.clickTimes.length,
        sortOrder: sortedInfo.columnKey === 'clickTimes' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: '点击率',
        dataIndex: 'clickRate',
        align: 'center',
        key: 'clickRate',
        filteredValue: filteredInfo.clickRate || null,
        onFilter: (value, record) => record.clickRate.includes(value),
        sorter: (a, b) => a.clickRate.length - b.clickRate.length,
        sortOrder: sortedInfo.columnKey === 'clickRate' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: '发布人',
        dataIndex: 'publishedBy',
        align: 'center',
        key: 'publishedBy'
      },
      {
        key: 'action',
        title: '操作',
        align: 'center',
        width: 280,
        render: (items,text,index) => (
          <span>
            <Button type='link' className="antd-cp" onClick={this.listOpt.bind(this,items.id,'up')} disabled={index === 0}>上移</Button>
            <Button type='link' className="antd-cp" onClick={this.listOpt.bind(this,items.id,'down')} disabled={index === this.state.data.length-1}>下移</Button>
            <Button type='link' className="antd-cp"  onClick={this.listOpt.bind(this,items.id,'top')} disabled={index === 0}>置顶</Button>
            <Button type="link" onClick={() => this.handlePreview(text, index)}>预览</Button>
          </span>
        )
      }
    ];
    return (
      <div>
        <div className="content">
          <div className="select-group">
              <ModuleSelection pageId = {this.getPageValue} initValue={true}/>
            </div>
          <Table columns={columns} dataSource={this.state.data} onChange={this.handleChange}  rowKey="id" pagination ={false}/>
        </div>
        <Modal
          title="预览"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          >
          <div className="adGroupDetail-previer" >
            <Phone reviewTxt={this.state.adTitle} preview={this.state.preview} />
          </div>
        </Modal>
      </div>
    );
  }
}
export default AdTypes;
