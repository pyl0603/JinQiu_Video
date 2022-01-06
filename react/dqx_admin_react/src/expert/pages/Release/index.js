import React from 'react';
import { Radio, Button, Col, Row, Input, Table, Modal, message } from 'antd';
import moment from 'moment'
import { getPlaytype, getPlanprice, getMatch, getPlansOdds, addPlans, wordsCheck } from '../../api/release'

import GetComp from './getComp';

import './index.scss'

const { TextArea } = Input;

class Release extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 1,
      playTypeValue: '1',
      priceValue: 1,
      compData: [],
      compId: 0,
      tableData: [],
      playType: [],
      planprice: [],
      visible: false,
      category: 0,
      isodds: false,
      isPlans: false,
      matchTime: Date.parse(new Date()),
      matchTimeShow: '',
      compName: '',
      competitionName: '',
      title: '',
      content: '',
      companyId: '',
      competitionId: '',
      plansCont: {
        homePoint: '',
        handicap: '',
        awayPoint: ''
      }
    }
  }

  componentDidMount() {
    let category = this.props.match.path.indexOf('football') > -1 ? 0 : 1
    this.setState({
      category: category
    }, () => {
      this.getPlaytypeList();
      this.getPlanpriceList();
    })
  }

  /**
   * 获取比赛列表
   */
  async getComp() {
    let data = await getMatch({ category: this.state.category, matchTime: this.state.matchTime, playType: this.state.value,competitionId: this.state.competitionId })
    this.setState({
      compData: data.data,
      visible: true,
      isPlans: false,
      isodds: false
    })
  }

  /**
   * 比赛时间选择
   */
  async changeTime(e) {
    this.setState({
      matchTime: e
    }, () => {
      this.getComp()
    })
  }

  /**
   * 联赛选择回调
   */

   async compType(e){
    this.setState({
      competitionId: e
    }, () => {
      this.getComp()
    })
   }

  /**
   * 获取玩法类型
   */
  async getPlaytypeList() {
    getPlaytype({ category: this.state.category }).then(res => {
      this.setState({
        playType: res.data,
        value: res.data[0].value
      })
    })
  }

  /**
   * 方案价格类型
   */
  async getPlanpriceList() {
    getPlanprice().then(res => {
      this.setState({
        planprice: res.data,
        priceValue: res.data[0].value
      })
    })
  }


  /**
   * 比赛选择回调
   */
  async chooseItem(e) {
    let data = await getPlansOdds({ id: e.id, category: this.state.category, playType: this.state.value })
    this.setState({
      visible: false,
      compId: e.id,
      tableData: data.data,
      isodds: true,
      compName: e.homeTeamName + 'VS' + e.awayTeamName,
      competitionName: e.competitionName,
      matchTimeShow: e.match_time
    })
  }

  /**
   * 方案标题
   */
  titleChange = (e) => {
    this.setState({
      title: e.target.value
    })
  }

  /**
 * homePoint数据
 */
  homePointInput = (e) => {
    let data = this.state.plansCont
    data.homePoint = e.target.value
    this.setState({
      data
    })
  }

  /**
 * handicap数据
 */
  handicapInput = (e) => {
    let data = this.state.plansCont
    data.handicap = e.target.value
    this.setState({
      data
    })
  }

  /**
* awayPoint数据
*/
  awayPointInput = (e) => {
    let data = this.state.plansCont
    data.awayPoint = e.target.value
    this.setState({
      data
    })
  }
  /**
   * 方案内容
   */
  contentChange = (e) => {
    this.setState({
      content: e.target.value
    })
  }

  /**
   * 关闭弹窗
   */
  onCancel = () => {
    this.setState({
      visible: false
    })
  }

  /**
   * 选择玩法
   */
  onChange = (e) => {
    this.setState({
      value: e.target.value,
      isPlans: false,
      isodds: false,
      compName: ''
    })
  }

  /**
   * 获取金额
   */
  onChangePrice = (e) => {
    this.setState({
      priceValue: e.target.value
    })
  }

  /**
   * 选择盘口
   */
  getOdds = (e) => {
    this.setState({
      isPlans: true,
      plansCont: e,
      companyId: e.companyId
    })
  }

  /**
   * 提交方案
   */
  async submit() {
    this.addPlans()
  }

  /**
   * 选择方案
   */
  choosePlans = (e) => {
    this.setState({
      playTypeValue: e.target.value
    })
  }

  /**
   * 发布方案
   */
  async addPlans() {
    let Item
    if (this.state.value === 1 || this.state.value === 3) {
      let obj = this.state.playTypeValue === '1' ? 1 : 2
      Item = { bigOrSmallBall: obj }
    }
    if (this.state.value === 2 || this.state.value === 4) {
      let obj = this.state.playTypeValue === '1' ? 1 : 2
      Item = { homeOrAwayWin: obj }
    }
    let wordsChecks = await wordsCheck({ content: this.state.title + this.state.content })
    if (Object.keys(wordsChecks.data).length !== 0) {
      let item = ''
      for (let key in wordsChecks.data) {
        item += '检测到违规词汇' + key + '：建议修改为' + wordsChecks.data[key] + '\n'
      }
      message.error({ content: '检测到违规词汇' + '\n' + item, duration: 20 })
      return
    }
    if (this.state.compId === 0) {
      message.info('请先选择比赛')
      return
    }
    if (this.state.companyId === '') {
      message.info('请先选择盘口数据')
      return
    }
    if (this.state.title === '') {
      message.info('请先填写标题')
      return
    }
    if (this.state.content.length < 100) {
      message.info('请先填写不少于100字的内容')
      return
    }
    let data = {
      category: this.state.category,
      playType: parseInt(this.state.value),
      matchId: this.state.compId,
      planPrice: this.state.priceValue,
      title: this.state.title,
      homePoint: this.state.plansCont.homePoint,
      handicap: this.state.plansCont.handicap,
      awayPoint: this.state.plansCont.awayPoint,
      content: this.state.content,
      companyId: this.state.companyId
    }
    let datas = Object.assign(data, Item)
    addPlans(datas).then(res => {
      message.info('操作成功')
      this.props.history.push('/release/programme')
    })
  }


  render() {
    let homeName, awayName = ''
    if (this.state.category === 0) {
      homeName = this.state.value === 1 ? '大球' : '主'
      awayName = this.state.value === 1 ? '小球' : '客'
    } else {
      homeName = this.state.value === 3 ? '大分' : '主'
      awayName = this.state.value === 3 ? '小分' : '客'
    }
    const columns = [
      {
        title: '公司',
        dataIndex: 'companyName'
      },
      {
        title: homeName,
        align: 'center',
        dataIndex: 'homePoint'
      },
      {
        title: '盘口',
        align: 'center',
        dataIndex: 'handicap'
      },
      {
        title: awayName,
        align: 'center',
        dataIndex: 'awayPoint'
      },
      {
        key: 'action',
        title: '操作',
        align: 'center',
        render: (text, item, index) => (
          <span>
            <Button type="link" onClick={this.getOdds.bind(this, item)}>选择</Button>
          </span>
        )
      }
    ]
    return (
      <div>
        <Row>
          <Col span={15} className="content-phone">
            <Row align="middle" justify="center">
              <Col flex="100px">
                <label>推荐：</label>
              </Col>
              <Col flex="auto">
                <Radio.Group onChange={this.onChange} value={this.state.value} >
                  {
                    this.state.playType.map((res, index) => {
                      return (<Radio value={res.value} key={index}>{res.display}</Radio>)
                    })
                  }
                </Radio.Group>
              </Col>
            </Row>
            <Row>
              <Col flex="100px">
                <label>选择比赛：</label>
              </Col>
              <Col flex="auto">
                <Button block onClick={this.getComp.bind(this)}>{this.state.compName === '' ? '请选择比赛' : (this.state.competitionName + '、' + this.state.compName)}</Button>
              </Col>
            </Row>
            {
              this.state.isPlans ? (
                <div>
                  <Row>
                    <Col flex="100px">
                      <label>预测选项：</label>
                    </Col>
                    <Col flex="auto">
                      <Radio.Group defaultValue="1" buttonStyle="solid" className="special-radio" value={this.state.playTypeValue} onChange={this.choosePlans}>
                        {this.state.value === 1 || this.state.value === 3 ? null : (
                          <Radio.Button value="0" disabled>
                            <em>主{this.state.plansCont.handicap}</em>
                          </Radio.Button>
                        )
                        }
                        <Radio.Button value="1">
                          <em>{this.state.value === 1 ? '大球(结果大于' + this.state.plansCont.handicap + ')' : null}{this.state.value === 3 ? '大分(结果大于' + this.state.plansCont.handicap + ')' : null}{this.state.value === 2 || this.state.value === 4 ? '主胜' : null}</em>
                          <em>{(this.state.value === 1 || this.state.value === 3) ? '赔率：' + this.state.plansCont.homePoint : this.state.plansCont.homePoint}</em>
                        </Radio.Button>
                        <Radio.Button value="2">
                          <em>{this.state.value === 1 ? '小球(结果小于' + this.state.plansCont.handicap + ')' : null}{this.state.value === 3 ? '小分(结果小于' + this.state.plansCont.handicap + ')' : null}{this.state.value === 2 || this.state.value === 4 ? '客胜' : null}</em>
                          <em>{(this.state.value === 1 || this.state.value === 3) ? '赔率：' + this.state.plansCont.awayPoint : this.state.plansCont.awayPoint}</em>
                        </Radio.Button>
                      </Radio.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>{homeName}：<Input value={this.state.plansCont.homePoint} onChange={this.homePointInput} style={{ width: 'calc(100% - 50px)' }}></Input></Col>
                    <Col span={8}>盘口：<Input value={this.state.plansCont.handicap} onChange={this.handicapInput} style={{ width: 'calc(100% - 50px)' }}></Input></Col>
                    <Col span={8}>{awayName}：<Input value={this.state.plansCont.awayPoint} onChange={this.awayPointInput} style={{ width: 'calc(100% - 50px)' }}></Input></Col>
                  </Row>
                </div>
              ) : null
            }

            <Row>
              <Col flex="100px">
                <label>方案金额：</label>
              </Col>
              <Col flex="auto">
                <Radio.Group value={this.state.priceValue} onChange={this.onChangePrice} buttonStyle="solid" size="large" className="spacing-radio">
                  {
                    this.state.planprice.map((res, index) => {
                      return (<Radio.Button value={res.value} key={index}>{res.display}</Radio.Button>)
                    })
                  }
                </Radio.Group>
              </Col>
            </Row>
            <Row>
              <Col flex="100px">
                <label>头部标题：</label>
              </Col>
              <Col flex="auto">
                <Input placeholder="请输入标题(标题请不要表明投注倾向，36个字内)" value={this.state.title} onChange={this.titleChange} maxLength={36}></Input>
                {/* {this.state.title.length === 2 || this.state.title.length === 4 ? (<span>2</span>) : null} */}
              </Col>
            </Row>
            <Row>
              <Col flex="100px">
                <label>文章内容</label>
              </Col>
              <Col flex="auto">
                <TextArea placeholder="请输入内容" rows="6" value={this.state.content} onChange={this.contentChange}></TextArea>
                <span className="dis-flex-end"><em>当前字数是{this.state.content.length}</em></span>
              </Col>
            </Row>
            <Row className="remind-txt">
              备注：<br />
              1.方案内容标准：推荐理由≥100字，必须含两队基本面分析及指数分析（不得抄袭）<br />
              2.方案提交审核后，我们将尽快处理。<br />
              3.每场比赛每种推荐只能各发布一次方案内容<br />
              4.杜绝一切抄袭行为，一经发现先警告，若警告后再次发现将永久封号并清理账户资料与今球币<br />
              5.杜绝发送任何广告外围信息，一经发现永久封号并清理账户资料与今球币<br />
            </Row>
          </Col>
          {
            this.state.isodds ? (
              <Col span={8} justify="center" offset={1}>
                <div>{this.state.competitionName}  {this.state.compName}  {moment(this.state.matchTimeShow).format('YYYY-MM-DD HH:mm:ss')}</div>
                <Table columns={columns} dataSource={this.state.tableData} pagination={false} rowKey='companyId'></Table>
              </Col>
            ) : null
          }

        </Row>
        <div style={{ textAlign: "center" }}>
          <Button type="primary" onClick={this.submit.bind(this)}>提交审核</Button>
        </div>
        <Modal
          visible={this.state.visible}
          title="赛事选择"
          footer={null}
          onCancel={this.onCancel}
          className="big-modal"
        >
          <GetComp compData={this.state.compData} chooseItem={this.chooseItem.bind(this)} changeTime={this.changeTime.bind(this)} compType={this.compType.bind(this)} category={this.state.category} />
        </Modal>
      </div>
    )
  }
}

export default Release;
