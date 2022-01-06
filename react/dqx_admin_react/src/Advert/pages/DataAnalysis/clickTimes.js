import React from 'react';
import ReactEcharts from 'echarts-for-react';

class ClickTimes extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	/**
	 * @description 配置图表
	 * @returns 
	 * @memberof EchartsRadar
	 */
	getOption() {
		let xData = this.props.xData
		let series = this.props.series
		console.log(series)
		return {
			title: {
				text: this.props.ctTxt,
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: [
				{
					icon: "square",
					right: 'right',
					padding: [30,-20,0,0],
					data: this.state.legendData,
				}
			],
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: xData
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					formatter: '{value}'
				}
			},
			series: series
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
			<div className="echartsRadar" style={{ height: 500,background: '#ffffff' }}>
				<ReactEcharts
					option={this.getOption()}
					notMerge={true}
					lazyUpdate={true}
					onEvents={onEvents}
					style={{ width: '100%', height: '100%' }}
				/>
			</div>
		)
	}
}
export default ClickTimes;