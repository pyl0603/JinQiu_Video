import React from 'react'
import { Radio, Row, Col, Input } from 'antd'
import moment from 'moment'
import '../Release/index.scss'

const { TextArea } = Input;

class ProDet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data
    }
  }

  componentDidMount () {
		this.setState({
			data: this.props.data
		})
	}

	/**
	 * 传入的props不一样则改变
	 * @param {*} nextProps 
	 * @param {*} prevState 
	 */
	static getDerivedStateFromProps(nextProps, prevState) {
		if (prevState.data !== nextProps.data) {
			return {
				data: nextProps.data
			}
    }
		return null
  }
	
  render() {
    const categoryText = this.state.data.category.value === 0 ? '球' : '分'
    let iconType = {
      1: () => {
        return 'shenhe'
      },
      2: () => {
        return 'tongguo'
      },
      3: () => {
        return 'bohui'
      },
      4: () => {
        return 'chaoshi'
      }
    }
    return (
      <div>
        <div className="title">
          <Row align="middle">
            <Col flex="50px">
              <label>标题：</label>
            </Col>
            <Col flex="auto"><Input value={this.state.data.title} disabled></Input></Col>
          </Row>
          <Row align="middle">
            <Col flex="50px">
              <label>作者：</label>
            </Col>
            <Col flex="200px"><Input value={this.state.data.publisher.nickName} disabled></Input></Col>
          </Row>
          <Row align="middle">
            <Col flex="50px">
              <label>赛事：</label>
            </Col>
            <Col flex="200px"><Input value={this.state.data.competitionName} disabled></Input></Col>
            <Col flex="50px" offset={2}>
              <label>时间：</label>
            </Col>
            <Col flex="200px"><Input value={moment(this.state.data.createdAt).format('YYYY-MM-DD HH:mm:ss')} disabled></Input></Col>
          </Row>
          <Row align="middle" justify="space-between">
            <Col flex="auto">
              <div style={{ marginBottom: '8px' }}>{this.state.data.homeTeamName} VS {this.state.data.awayTeamName}</div>
              {this.state.data.playType.value === 1 || this.state.data.playType.value === 3 ? (
                <Radio.Group defaultValue={this.state.data.bigOrSmallBall.value} value={this.state.data.bigOrSmallBall.value}  buttonStyle="solid" className="special-radio" disabled>
                  <Radio.Button value={1}>
                    <em>大{categoryText}(结果大于{this.state.data.handicap})</em>
                    <em>赔率：{this.state.data.homePoint}</em>
                    {
                      (this.state.data.bigOrSmallBall.value === 1 && this.state.data.matchResult.value === 2) ? <i className='succ-icon-left'></i> : null
                    }
                    {
                      (this.state.data.bigOrSmallBall.value === 2 && this.state.data.matchResult.value === 3) ? <i className='fail-icon-left'></i> : null
                    }
                  </Radio.Button>
                  <Radio.Button value={2}>
                    <em>小{categoryText}(结果小于{this.state.data.handicap})</em>
                    <em>赔率：{this.state.data.awayPoint}</em>
                    {
                      (this.state.data.bigOrSmallBall.value === 2 && this.state.data.matchResult.value === 2) ? <i className='succ-icon-right'></i> : null
                    }
                    {
                      (this.state.data.bigOrSmallBall.value === 1 && this.state.data.matchResult.value === 3) ? <i className='fail-icon-right'></i> : null
                    }
                  </Radio.Button>
                </Radio.Group>
              ) : null}
              {this.state.data.playType.value === 2 || this.state.data.playType.value === 4 ? (
                <Radio.Group defaultValue={this.state.data.homeOrAwayWin.value} value={this.state.data.homeOrAwayWin.value} buttonStyle="solid" className="special-radio" disabled>
                  <Radio.Button value={1}>
                    <em>主胜：{this.state.data.homePoint}</em>
                    {
                      (this.state.data.homeOrAwayWin.value === 1 && this.state.data.matchResult.value === 2) ? <i className='succ-icon-left'></i> : null
                    }
                    {
                      (this.state.data.homeOrAwayWin.value === 2 && this.state.data.matchResult.value === 3) ? <i className='fail-icon-left'></i> : null
                    }
                  </Radio.Button>
                  
                  <Radio.Button value={3} disabled>
                    <em>主{this.state.data.handicap}</em>
                  </Radio.Button>
                  <Radio.Button value={2}>
                    <em>客胜：{this.state.data.awayPoint}</em>
                    {
                      (this.state.data.homeOrAwayWin.value === 2 && this.state.data.matchResult.value === 2) ? <i className='succ-icon-right'></i> : null
                    }
                    {
                      (this.state.data.homeOrAwayWin.value === 1 && this.state.data.matchResult.value === 3) ? <i className='fail-icon-right'></i> : null
                    }
                  </Radio.Button>
                </Radio.Group>
              ) : null}
            </Col>
            <Col flex='300px'>
              <Row align="middle">
                <Col flex="50px">
                  <label>推荐：</label>
                </Col>
                <Col flex="200px"><Input value={this.state.data.playType.display} disabled></Input></Col>
              </Row>
              <Row align="middle">
                <Col flex="50px">
                  <label>金额：</label>
                </Col>
                <Col flex="200px"><Input value={this.state.data.planPrice.value} disabled></Input></Col>
              </Row>
            </Col>
          </Row>       
          <Row align="middle">
            <Col flex="80px">方案内容：</Col>
            <Col flex="auto">
              <TextArea rows="12" value={this.state.data.content} disabled></TextArea></Col>
          </Row>
            <img src={require('@eximg/ic_' + `${iconType[this.state.data.planStatus.value]()}` + '.png')} className='plans-status-icon'/>
          <Row align="middle">
            <Col flex="80px">驳回原因：</Col>
            <Col flex="auto">
              <TextArea rows="2" value={this.state.data.rejectReason} disabled></TextArea></Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default ProDet