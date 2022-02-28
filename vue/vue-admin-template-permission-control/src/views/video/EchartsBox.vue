<template>
  <div id="test_app">
    <!--echarts的容器-->
    <slot name="content"></slot>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "EchartsBox",
  props: {
    timeStatisticals: {
      type: Array,
      default: () => []
    },
		Totime: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      charts: "",
      opinionData: [], //数据
			time:[],
    };
  },
  methods: {
    drawLine(id) {
      this.charts = echarts.init(document.getElementById(id));
      this.charts.setOption({
        title: {
          left: "3%",
          top: "5%",
          text:this.timeStatisticals.playCount? "播放计数":'观看计数' //标题文本，支持使用 \n 换行。
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          align: "right", //文字在前图标在后
          left: "3%",
          top: "15%",
          // data: ["近一周"]
        },
        grid: {
          top: "30%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true
        },

        toolbox: {
          feature: {
            saveAsImage: {} //保存为图片
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          axisTick: {
            alignWithLabel: true //保证刻度线和标签对齐
          },
          data: this.time //x坐标的名称
        },
        yAxis: {
          type: "value",
          boundaryGap: true,
          splitNumber: 4, //纵坐标数
          interval: 250 //强制设置坐标轴分割间隔
        },

        series: [
          {
            name: this.Totime[0]?`${this.Totime[0]} 至 ${this.Totime[1]}`:'',
            type: "line", //折线图line;柱形图bar;饼图pie
            stack: "总量",
            areaStyle: {
              //显示区域颜色---渐变效果
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgb(255,200,213)" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#ffffff" // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            },
            itemStyle: {
              color: "rgb(255,96,64)", //改变折线点的颜色
              lineStyle: {
                color: "rgb(255,96,64)" //改变折线颜色
              }
            },
            data: this.opinionData
          }
        ]
      });
    }
  },
  //调用
  mounted() {
    this.$nextTick(function() {
      this.drawLine("main");
    });
  },
  watch: {
    timeStatisticals(newValue, oldValue) {
      let list = [];
			let time = []
      newValue.map(item => {
        list.push(item.playCount?item.playCount:item.readCount)
        // list.push("100");
				// time.push(`${item.startTime}-${item.endTime}`)
				// console.log(item.startTime.split(':').slice(0,2).join(':'))
				// console.log(item.endTime.split(':').slice(0,2).join(':'))
				time.push(`${item.startTime.split(':').slice(0,2).join(':')}-${item.endTime.split(':').slice(0,2).join(':')}`)
      });
      this.opinionData = list;
			this.time = time
			this.$nextTick(function() {
      this.drawLine("main");
      console.log(time);
      console.log(this.opinionData);
    })
      // console.log(this.opinionData);
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
