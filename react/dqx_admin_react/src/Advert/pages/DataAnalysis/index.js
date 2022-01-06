import React from 'react';
// import echarts from 'echarts/lib/echarts';
import ReactEcharts from 'echarts-for-react';
import { DatePicker, Select } from 'antd';
import { getTotal, getToday } from '@api/analysis.js';
import { getAdGroup } from '@api/createAd.js';
import moment from 'moment'
import ClickTimes from './clickTimes';

const { Option } = Select;

class EchartsRadar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: '',
      end: '',
      xData: [],
      title: '广告数据分析',
      adGroupCurren: '-1',
      adGroup: [],
      legendData: [],
      seriesData: [],
      clickTimesData: '',
      ctTxt: '点击次数分析',
      ShowTimesData: '',
      stTxt: '展示次数分析',
      clickRatesData: '',
      crTxt: '点击率分析',
      groupId: '',
      todayTxt: '',
      day:'',
      month:'',
      year:''
    };
    // this.indicator = []
  }

  componentDidMount() {
    let nowDate = new Date()
    let year = nowDate.getFullYear()
    let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
      : nowDate.getMonth() + 1
    let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
      .getDate()
    let dateStr = year + month + day
    this.setState({
      start: dateStr,
      end: dateStr
    }, () => {
      //获取广告组列表
      this.setState({})
      this.getAdGroupList()
      this.getTodayList()
      this.getTotalList()
    })
  }

  /**
   * 选择广告组
   */
  handleAdGroup = (current) => {
    let data = current == -1 ? '' : current
    this.setState({
      adGroupCurren: current,
      groupId: data
    }, () => {
      this.getTotalList()
    })
  }

  /**
   * 获取广告组列表
   */
  getAdGroupList() {
    const params = {
      status: 1,
      clientType: this.state.platform  // 客户端类型：0-APP 1-直播PC端
    }
    getAdGroup(params).then(res => {
      this.setState({
        adGroup: res.data
      })
    }).catch(err=>console.log(err))
  }

  	/**
	 * 选择平台
	 */
	handlePlatform = (current) => {
		this.setState({
			platform: current
		}, () => {
			this.getAdGroupList()
		})
  }

  async getTotalList() {
    let data = {
      id: this.state.groupId,
      startDate: this.state.start,
      endDate: this.state.end
    }
    if(data.startDate == "") return
    console.log(data,'data----------------------');
      if(data.startDate===2048||data.endDate===2048){
        return
      }else{
        if(data.startDate != 203303) {
          console.log(data.startDate,'caonima')
          getTotal(data).then(res => {
            const items = []
            items.push({ name: '展示次数', type: 'line', data: res.data.clickTimes })
            items.push({ name: '点击次数', type: 'line', data: res.data.showTimes })
            items.push({
              name: '点击率', type: 'line', data: res.data.clickRates, symbolSize: 0, showSymbol: false, lineStyle: {
                width: 0,
                color: 'rgba(0, 0, 0, 0)'
              }
            })
            this.setState({
              xData: res.data.times,
              seriesData: items,
              legendData: ['展示次数', '点击次数'],
              clickTimesData: res.data.ads.clickTimes,
              ShowTimesData: res.data.ads.showTimes,
              clickRatesData: res.data.ads.clickRates
      
            }, () => { })
            console.log(this.state.clickTimesData)
          }).catch(err=>console.log(err))
        }
      }
  }

  /**
   * 获取当天统计图表
   */
  async getTodayList() {
    getToday().then(res => {
      this.setState({
        todayTxt: res.data
      })
    }).catch(err=>console.log(err))
  }

  /**
   * 时间变化
   */
  onChangeDay(date, dateString) {
    this.setState({
      start: dateString,
      end: dateString,
      day:date,
      month:'',
      year: ''
    }, () => {
      this.getTotalList()
    })
  }

  onChangeMonth(date, dateString) {
    let dataDay
    let month = date._d.getMonth() + 1
    let year = date._d.getYear()
    switch (month) {
      case 1: case 3: case 5: case 7: case 8: case 10: case 12:
        dataDay = 31
        break;
      case 4: case 6: case 9: case 11:
        dataDay = 30
        break;
      case 2:
        dataDay = year % (year % 100 ? 4 : 400) ? 28 : 29
        break;
    }
    this.setState({
      start: dateString + '01',
      end: dateString + dataDay,
      day:'',
      month:date,
      year: ''
    }, () => {
      this.getTotalList()
    })
  }

  onChangeYear(date, dateString) {
    this.setState({
      start: dateString + '0101',
      end: dateString + '1231',
      day:'',
      month:'',
      year: date
    }, () => {
      this.getTotalList()
    })
  }


  /**
   * @description 配置图表
   * @returns 
   * @memberof EchartsRadar
   */
  getOption() {
    return {
      title: {
        text: this.state.title,
        subtext: this.state.subtext
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: [
        {
          icon: "square",
          top: 'top',
          itemGap: 18,
          padding: 15,
          textStyle: {
            "color": "#000",
            padding: [0, 0, 0, -5],
          },
          data: this.state.legendData,
        }
      ],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.state.xData
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}'
        }
      },
      series: this.state.seriesData
    }
  }

  /**
   * @description 雷达图选中区域点击事件和外部显示标签点击事件
   * @param {any} param 
   * @param {any} echarts 
   * @memberof EchartsRadar
   */
  onChartClick(param) {
    console.log(param)
  }
  /**
   * @description 点击legend事件
   * @param {any} param 
   * @param {any} echarts 
   * @memberof EchartsRadar
   */
  onChartLegendselectchanged(param) {
    console.log(param)
  }
  render() {
    let onEvents = {
      'click': this.onChartClick.bind(this),
      'legendselectchanged': this.onChartLegendselectchanged.bind(this)
    }
    return (
      <div className="echartsRadar" style={{ height: '100%', background: '#ffffff' }}>
        <div className="select-group antd-mb dis-flex-between">
          <div>
            今日数据：<span> 展示次数：{this.state.todayTxt.todayViews}</span> <span className='antd-ml8'>点击次数：{this.state.todayTxt.todayClicks}</span> <span className='antd-ml8'>点击率：{this.state.todayTxt.todayClickRate}</span>
          </div>
          <div className='choose-time'>
            <Select style={{width: 150}} defaultValue={0} value={this.state.platform} onChange={this.handlePlatform}>
							<Option key={0} value={0}>APP</Option>
							<Option key={1} value={1}>直播PC端</Option>
						</Select>
            <Select className='antd-ml8' placeholder="请选择" value={this.state.adGroupCurren} onChange={this.handleAdGroup} style={{ width: 200 }}>
              <Option key='-1' value='-1'>全部</Option>
              {
                this.state.adGroup.map((item, index) => {
                  return <Option key={index++} value={item.id}>{item.name}</Option>
                })
              }
            </Select>
            <DatePicker value={this.state.day} onChange={this.onChangeDay.bind(this)} format="YYYYMMDD" className='antd-ml8'/>
            <DatePicker value={this.state.month} onChange={this.onChangeMonth.bind(this)} picker="month" format="YYYYMM" className='antd-ml8' />
            <DatePicker value={this.state.year} onChange={this.onChangeYear.bind(this)} picker="year" className='antd-ml8' />
          </div>
        </div>
        <ReactEcharts
          option={this.getOption()}
          notMerge={true}
          lazyUpdate={true}
          onEvents={onEvents}
          style={{ width: '100%', height: 500 }}
        />
        {/* 暂时不展示详细数据 */}
        {/* {
          this.state.adGroupCurren === '00' ? null :
            <div>
              <ClickTimes series={this.state.clickTimesData} ctTxt={this.state.ctTxt} xData={this.state.xData} />
              <ClickTimes series={this.state.ShowTimesData} ctTxt={this.state.stTxt} xData={this.state.xData} />
              <ClickTimes series={this.state.clickRatesData} ctTxt={this.state.crTxt} xData={this.state.xData} />
            </div>
        } */}
      </div>
    )
  }
}
export default EchartsRadar;