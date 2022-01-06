<template>
  <div class="inv-chart">
    <el-row class="has-border">
      <el-col :span="6" v-for="item in titleList" :key="item.id">
        <span>较昨日：+{{ item.increase }}</span>
        <span>{{ item.value }}</span>
        <span>{{ item.name }}</span>
      </el-col>
    </el-row>
    <el-row class="tar mt20">
      <el-date-picker
        v-model="dataRang"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="timestamp"
        @change="change"
        align="right"
      ></el-date-picker>
    </el-row>
    <div
      id="myLineChart"
      :style="{ width: '100%', height: '500px' }"
      class="mt50"
    ></div>
    <Pie ref="Pie"></Pie>
    <!-- <div class="center-pie">
      <div
        id="myPieTwoChart"
        :style="{ width: '400px', height: '400px' }"
      ></div>
      <div id="myPieChart" :style="{ width: '400px', height: '400px' }"></div>
    </div> -->
    <div
      id="myChart"
      :style="{ width: '100%', height: '500px' }"
      class="mt50"
    ></div>
  </div>
</template>
<script>
import echarts from "echarts";
import {
  getGiftOut,
  getGiftSingle,
  getTitleCount,
  getRangeCount
} from "@/api/active.js";
import Pie from './pieLine.vue'
export default {
  name: "hello",
  data() {
    let _this = this;
    return {
      singlePie: [],
      activeId: 0,
      singlePieLe: [],
      pieTwoData: [],
      pieUseTitle: "",
      titleList: [],
      dataLine:[],
      dataLineLe: [],
      dataRang: [
        new Date(new Date()).getTime()-
        3600 * 1000 * 24 * 7,
        new Date(new Date()).getTime()
      ], //  时间选择
      tableData: [], //列表
      start:
        new Date(new Date().setHours(0, 0, 0, 0)).getTime() -
        3600 * 1000 * 24 * 7, //开始时间
      end: new Date(new Date().setHours(0, 0, 0, 0)).getTime(), //结束时间
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
              _this.start = new Date(new Date()).getTime();
              _this.end = new Date(new Date()).getTime();
              _this.dataRang = [_this.start, _this.end];
            }
          },
          {
            text: "三天内",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 72);
              picker.$emit("pick", date);
              _this.start =
                new Date(new Date()).getTime() - 3600 * 1000 * 24 * 3;
              _this.end = new Date(new Date()).getTime();
              _this.dataRang = [_this.start, _this.end];
            }
          },
          {
            text: "一周内",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
              _this.start =
                new Date(new Date()).getTime() - 3600 * 1000 * 24 * 7;
              _this.end = new Date(new Date()).getTime();
              _this.dataRang = [_this.start, _this.end];
            }
          }
        ]
      }
    };
  },
  components:{
    Pie
  },
  async mounted() {
    // 获取区间统计
    this.getDateRange();
    // 获取单个统计
    let { data } = await getTitleCount();
    this.titleList = data;
    this.titleList.map((res,index) => {
      if(index < 4){
        this.dataLineLe.push(res.name)
        this.dataLine.push(res)
      }
    })
    console.log(this.dataLine)
    // 礼品领取情况
    let lePieTwo = [];
    let PieTwo = await getGiftOut();
    let dataPieTwo = PieTwo.data;
    this.activeId = dataPieTwo[0].id;
    this.pieUseTitle = dataPieTwo[0].name;
    dataPieTwo.map(res => {
      lePieTwo.push(res.name);
    });
    // 单个
    let singlePieLe = [];
    let singlePie = await getGiftSingle(this.activeId);
    let dataSinPie = singlePie.data;
    dataSinPie.map(res => {
      singlePieLe.push(res.name);
    });
    this.drawLine(this.dataLine,this.dataLineLe);
    // this.drawPie(dataSinPie, singlePieLe);
    // this.drawPieTwo(dataPieTwo, lePieTwo);
    this.$store.commit("setPaging", false);
  },
  methods: {
    // 日期选择
    change(val) {
      this.start = val[0];
      this.end = val[1] + 3600 * 1000 * 24;
      this.getDateRange()
    },
    // 根据时间段获取注册比
    getDateRange() {
      getRangeCount({ start: this.start, end: this.end }).then(res => {
        let dataLe = [];
        let dataDownload = [];
        let dataShare = [];
        let dataRegister = [];
        res.data.map(e => {
          dataLe.push(e.date);
          dataDownload.push(e.download);
          dataShare.push(e.share);
          dataRegister.push(e.register);
        });
        console.log(dataDownload, dataShare, dataRegister)
        this.drawLines(dataLe, dataDownload, dataShare, dataRegister);
      });
    },
    // 获取单个活动
    getSingle() {
      getGiftSingle(this.activeId).then(res => {
        this.singlePie = res.data;
        res.data.map(e => {
          this.singlePieLe.push(e.name);
        });
      });
    },
    // 折线图
    drawLines(dataLe, dataDownload, dataShare, dataRegister) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myLineChart"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "注册比"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["分享", "下载", "注册"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: dataLe
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "分享",
            type: "line",
            data: dataShare
          },
          {
            name: "下载",
            type: "line",
            data: dataDownload
          },
          {
            name: "注册",
            type: "line",
            data: dataRegister
          }
        ]
      });
    },
    // // 饼图
    // drawPie(dataSinPie, singlePieLe) {
    //   // 基于准备好的dom，初始化echarts实例
    //   let myChart = echarts.init(document.getElementById("myPieChart"));
    //   // 绘制图表
    //   myChart.setOption({
    //     title: {
    //       text: "兑换码使用占比" + `(${this.pieUseTitle})`,
    //       left: "left"
    //     },
    //     tooltip: {
    //       trigger: "item",
    //       formatter: "{a} <br/>{b} : {c} ({d}%)"
    //     },
    //     legend: {
    //       // orient: "vertical",
    //       bottom: "bottom",
    //       data: singlePieLe
    //     },
    //     series: [
    //       {
    //         name: "使用比",
    //         type: "pie",
    //         radius: "55%",
    //         center: ["50%", "60%"],
    //         data: dataSinPie,
    //         emphasis: {
    //           itemStyle: {
    //             shadowBlur: 10,
    //             shadowOffsetX: 0,
    //             shadowColor: "rgba(0, 0, 0, 0.5)"
    //           }
    //         }
    //       }
    //     ]
    //   });
    // },
    // // 饼图
    // async drawPieTwo(data, e) {
    //   // 基于准备好的dom，初始化echarts实例
    //   let myChart = echarts.init(document.getElementById("myPieTwoChart"));
    //   // 绘制图表
    //   myChart.setOption({
    //     title: {
    //       text: "礼品领取情况",
    //       left: "left"
    //     },
    //     tooltip: {
    //       trigger: "item",
    //       formatter: "{a} <br/>{b} : {c} ({d}%)"
    //     },
    //     legend: {
    //       bottom: "bottom",
    //       data: e
    //     },
    //     series: [
    //       {
    //         name: "领取来源",
    //         type: "pie",
    //         radius: "55%",
    //         center: ["50%", "60%"],
    //         data: data,
    //         emphasis: {
    //           itemStyle: {
    //             shadowBlur: 10,
    //             shadowOffsetX: 0,
    //             shadowColor: "rgba(0, 0, 0, 0.5)"
    //           }
    //         }
    //       }
    //     ]
    //   });
    //   let _this = this;
    //   myChart.on("click", "series.pie", function(param) {
    //     let singlePieLe = [];
    //     _this.pieUseTitle = param.data.name;
    //     getGiftSingle(param.data.id).then(res => {
    //       let dataSinPie = res.data;
    //       dataSinPie.map(res => {
    //         singlePieLe.push(res.name);
    //       });
    //       _this.drawPie(dataSinPie, singlePieLe);
    //     });
    //   });
    // },
    // 漏斗图
    drawLine(data,le) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "用户漏斗图",
          center: "center"
          // subtext: "纯属虚构"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}"
        },
        toolbox: {
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        legend: {
          bottom: "bottom",
          data: le
        },

        series: [
          {
            name: "用户漏斗",
            type: "funnel",
            left: "10%",
            top: 60,
            //x2: 80,
            bottom: 60,
            width: "80%",
            // height: {totalHeight} - y - y2,
            min: 0,
            max: 100,
            minSize: "20%",
            maxSize: "100%",
            sort: "descending",
            gap: 2,
            label: {
              show: true,
              position: "inside"
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: "solid"
              }
            },
            itemStyle: {
              borderColor: "#fff",
              borderWidth: 1
            },
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            data: data
          }
        ]
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.inv-chart {
  height: calc(100vh - 200px);
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
}
.center-pie {
  display: flex;
  justify-content: space-around;
}
.has-border {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  border: 1px solid #eee;
}
.has-border span {
  display: block;
  width: 100%;
  text-align: center;
}
.has-border .el-col {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  height: 90px;
  padding: 10px 0;
  border-bottom: 1px solid #eeeeee;
}
.has-border .el-col + .el-col {
  border-left: 1px solid #eee;
}
</style>
