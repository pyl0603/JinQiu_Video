import React from 'react';
import { Input, DatePicker, Button, Table, Row, Col, Select, message } from 'antd';
import moment from 'moment';

import { competitions, matches, predicts, predictsRace, delpredictsRace, getRacePlay } from '../../api/race';

const { RangePicker } = DatePicker;
const { Option } = Select;

class Book extends React.Component {

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
        dataIndex: 'competitionName',
      },
      {
        key: 'title',
        title: '比赛名称',
				align: 'center',
			  render: (text, record,index) => (
          <div>
            {record.homeName} VS {record.awayName}
          </div>
        ),
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
        key: 'action',
        title: '操作',
        align: 'center',
        render: (text, item, index) => (
            <>
            {
              this.props.top 
              ?
              <Button type="link" className="antd-cp" onClick={() => this.handleRace(item)}>选择</Button>
              :
              <>
              {
                item.url
                ?
                <Button type="link" className="antd-cp" onClick={() => this.copy(item.url)}>复制源</Button>
                :
                null
              }
							<Button type="link" className="antd-cp" onClick={() => this.cancelbookRace(item)}>取消预约</Button>
              </>
            }
						</>
        )
      }
    ];

    // if (this.props.top) {
    //   this.columns.splice(0,0, {
    //     key: 'time',
    //     title: '比赛时间',
    //     align: 'center',
    //     render: (text, record, index) => (
    //       <span>{record.matchTime.toString().length === 13 ? moment(record.matchTime).format("YYYY-MM-DD hh:mm"):moment(record.matchTime*1000).format("YYYY-MM-DD hh:mm")}</span>
    //     )
    //   })
    // }

    if (!this.props.top) {
      this.columns.splice(2,0, {
				key: 'status',
				title: '比赛状态',
				align: 'center',
				dataIndex: 'status',
        render: (text, record, index) => (
          <span>{record.status.display}</span>
        )
			},)
    }
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
      }, () => {
				this.getData()
			}
    )
	}

  /**
	 * INput搜索框onchange事件
	 * @param {event} current -搜索框
	 */
  handleValue = (current) => {
    this.setState({
			value: current.target.value
		}, () => {
      this.getData()
    })
  }
  
  /**
  * 搜索的键盘事件
  * @param {*} e 
  */
  async searchKeyPress(e) {
    this.setState({
      searchlogs: e.target.value
		}, () => {
      this.getData()
    })
	}

	   /**
   * 翻页
   * @param {*} page 
   */
  changePage = (page) => {
    this.setState({
      pageIndex: page
    }, () => {
      this.getData()
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
    console.log(current, pageSize);
    this.setState({
      pageIndex: current,
      pageSize: pageSize
    }, () => {
      this.getData()
    })
  }

	/**
	 * 预约比赛
	 */
	async getData() {
		let params = {
      page: this.state.pageIndex,
      page_size: this.state.pageSize,
      start: this.state.startTime,
			end: this.state.endTime,
			category: this.props.category,
			name: this.state.value
		}
    const res = await predicts(params)
    const data = res.data
    data.map(item => {
      getRacePlay(item.category,item.id).then(res => {
        Object.assign(item, {url: res.data})
      })
    })
		this.setState({
      data: data,
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
			this.getData()
    })
	}

	/**
	 * 取消预约
	 */
	async cancelbookRace(data) {
		const category = this.props.category
		const id = data.matchId
		delpredictsRace(category, id).then(_ => {
        message.info('操作成功');
				this.getData()
    })
  }
  
  /**
   * 选中比赛值
   */
  handleRace = (item) => {
    this.props.selectedValue(item)
  }

  /**
   * 复制源
   */
  async copy (data) {
    let url = data.url;
    let oInput = document.createElement("input");
    oInput.value = url;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象;
    console.log(oInput.value);
    document.execCommand("Copy"); // 执行浏览器复制命令
    message.info('复制成功');
    oInput.remove();
  }
	
	componentDidMount() {
    this.getData()
	}
	
  render () {
		const options = this.state.competitionList.map(d => <Option key={d.id}>{d.nameZh}</Option>);
    return (
		<div className="race">
			<Row className="antd-mb" justify="space-between">
				<Col><label className="antd-mr">选择查看日期</label>
					<RangePicker 
					value={this.state.date}
					onChange = {this.changeDate} />
				</Col>
				<Col>
                <Input className="antd-mr" placeholder="请输入" style= {{width: 300}} value={this.state.value} onChange={this.handleValue} />
				</Col>
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

export default Book;
