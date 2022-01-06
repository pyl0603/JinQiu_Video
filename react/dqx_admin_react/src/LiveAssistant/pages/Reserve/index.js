import React from 'react';
import { Input, DatePicker, Button, Table, Row, Col, Select, message } from 'antd';
import moment from 'moment';

import { competitions, matches, predicts, predictsRace, delpredictsRace } from '../../api/race';

const { RangePicker } = DatePicker;
const { Option } = Select;

let timeout;
let currentValue;

class RaceTable extends React.Component {

  constructor(props) {
		super(props)
		
    this.state = {
      searchlogs: undefined,
      date: [moment(new Date(), 'YYYY/MM/DD'), moment(new Date(), 'YYYY/MM/DD')],
      dateString: ['', ''],
      startTime: moment(new Date()).valueOf(),
      endTime: moment(new Date()).valueOf(),
      data: [],
      pageIndex: 1,
      pageSize: 10,
			total: 0,
			competitionList: []
    }

    this.columns = [
      {
        key: 'competitionName',
        title: '联赛名称',
        align: 'center',
        dataIndex: 'competition',
      },
      {
        key: 'title',
        title: '比赛名称',
				align: 'center',
        dataIndex: 'title'
			},
			{
        key: 'time',
        title: '比赛时间',
        align: 'center',
        render: (text, record, index) => (
          <span>{record.matchTime.toString().length === 13 ? moment(record.matchTime).format("YYYY-MM-DD HH:mm"):moment(record.matchTime*1000).format("YYYY-MM-DD HH:mm")}</span>
        )
      },
      {
				key: 'status',
				title: '比赛状态',
				align: 'center',
				dataIndex: 'status',
				render: (text, record, index) => (
				  <span>{record.status ? record.status.display:''}</span>
				)
			},
			{
        key: 'action',
        title: '操作',
        align: 'center',
        render: (text, item, index) => (
            <>
							{this.props.book ? <Button type="link" className="antd-cp" >复制源</Button> : null}
							{!item.isPredict ? <Button type="link" className="antd-cp" onClick={() => this.bookRace(item)}>预约</Button>: <Button type="link" className="antd-cp" onClick={() => this.cancelbookRace(item)}>取消预约</Button>}
						</>
        )
      }
    ];
	}

	 /**
   * 
   * @param {[moment, moment]} values - 获取Moment
   * @param {[string, string]} dateStrings - 获取["2020-03-02", "2020-04-14"] 形式日期
   */
  changeDate = (values, dateStrings) => {
    this.setState(
      {
				date: values,
        dateString: dateStrings,
        startTime: dateStrings[0] == null || dateStrings[0] === '' ? '' :new Date(dateStrings[0]).getTime(),
        endTime: dateStrings[1] == null || dateStrings[1] === '' ? '' :new Date(dateStrings[1]).getTime()
      }
    )
	}
	
	 	/**
	 * 搜索框onchange事件
	 * @param {event} current -搜索框
	 */
  handleSearchInput = (current) => {
    this.setState({
			searchlogs: current
		}, () => {
			if (this.props.book) {
				this.getData()
			}
		})
	}

search = (value, callback) => {
	const that = this
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  function fake() {
		if (currentValue === value) {
			competitions({name: value, category: that.props.category}).then(res => {
				callback(res.data);
			})
		}
  }

  timeout = setTimeout(fake, 600);
}


	handleSearch = value => {
    if (value) {
			this.search(value, data => {
				this.setState({
					competitionList: data
				})
			});
    } else {
      this.setState({ competitionList: [] });
    }
  };

  
  /**
  * 搜索的键盘事件
  * @param {*} e 
  */
  async searchKeyPress(e) {
    this.setState({
      searchlogs: e.target.value
		}, () => {
			if (this.props.book) {
				this.getData()
			}
		})
	}

	   /**
   * 翻页
   * @param {*} page 
   */
  changePage = (page) => {
		console.log(1, page);
    this.setState({
      pageIndex: page
    }, () => {
      this.getList()
    })
	}
	
	/**
   * 提示表格共有多少条
   * @param {*} total 
   * @param {*} range 
   */
  showTotal = (total, range) => {
    return `共有${total}条数据，当前每页最多显示${this.state.pageSize}条`
  }


	/**
   * 改变每页显示条目数
   */
  onShowSizeChange = (current, pageSize) => {
    this.setState({
      pageIndex: current,
      pageSize: pageSize
    }, () => {
      this.getList()
    })
  }

	/**
	 * 查询列表
	 */
	async getList() {
		if (this.state.searchlogs == null) {
			return
		}
		let params = {
      page: this.state.pageIndex,
      page_size: this.state.pageSize,
      start: this.state.startTime,
			end: this.state.endTime,
			category: this.props.category,
			competitionId: this.state.searchlogs
		}
		const res = await matches(params)
		this.setState({
      data: res.data,
      pageIndex: res.meta.pagination.currentPage,
			pageSize: res.meta.pagination.perPage,
      total: res.meta.pagination.total
    })
	}

	/**
	 * 预约比赛
	 */
	async bookRace(data) {
		console.log(data)
		let params = {
			matchId: data.id,
			category: this.props.category,
			competitionName: data.competition,
			matchTime: data.matchTime,
			homeName: data.home.name,
			awayName: data.away.name,
      competitionId: this.state.searchlogs,
      homeLogo: data.home.logo,
      awayLogo: data.away.logo
    }
		predictsRace(params).then(_ => {
      message.info('操作成功');
			if (this.props.book) {
				this.getData()
			} else {
				this.getList()
			}
    })
	}

	/**
	 * 取消预约
	 */
	async cancelbookRace(data) {
		const category = this.props.category
		const id = data.id
		delpredictsRace(category, id).then(_ => {
      message.info('操作成功');
			if (this.props.book) {
				this.getData()
			} else {
				this.getList()
			}
    })
	}

	/**
	 * 搜索
	 */
	searchResult = () => {
		if (this.state.searchlogs == null) {
			message.info("请输入联赛名次、比赛名称")
		}
		this.getList()
	}
	
	componentDidMount() {
		if (this.props.book) {
			this.getData()
		}
	}
	
  render () {
		const options = this.state.competitionList.map(d => <Option key={d.id}>{d.nameZh}</Option>);
    return (
		<div className="race">
			<Row justify="space-between">
				<Col>
					<Select
						showSearch 
						value={this.state.searchlogs}
						placeholder="请输入联赛名次、比赛名称"
						style= {{width: 300}}
						onChange={this.handleSearchInput}
						onSearch={this.handleSearch}
						defaultActiveFirstOption={false}
						showArrow={false}
						filterOption={false}
						notFoundContent={null}
						>
							{options}
					</Select>
					<label className="antd-mr antd-ml8">选择查看日期</label>
					<RangePicker 
					value={this.state.date}
					onChange = {this.changeDate} />
					<Button className="antd-mr antd-ml8" onClick={this.searchResult}>搜索</Button>
				</Col>
				{/* {
					this.props.book
					?
					<Input className="antd-mr" placeholder="请输入" style= {{width: 300}} value={this.state.value} onChange={this.handleValue} />
					:
					<Select 
					showSearch 
					value={this.state.searchlogs}
					placeholder="请输入联赛名次、比赛名称"
					style= {{width: 300}}
					onChange={this.handleSearchInput}
					onSearch={this.handleSearch}
					defaultActiveFirstOption={false}
					showArrow={false}
					filterOption={false}
					notFoundContent={null}
					>
						{options}
				</Select>
				} */}
			</Row>
      <Table columns={this.columns} dataSource={this.state.data} rowKey="id" 
      pagination = {{
        total: this.state.total,
        pageSize: this.state.pageSize,
        current: this.state.pageIndex,
        onChange: this.changePage,
        showTotal: this.showTotal,
        onShowSizeChange: this.onShowSizeChange
      }}
      />
		</div>
    );
  }
}

export default RaceTable;

RaceTable.defaultProps = {
	book: false
}