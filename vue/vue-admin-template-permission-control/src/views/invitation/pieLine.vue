<template>
  <div>
    <el-row class="mt20">
      <el-col :span="12">
        礼品等级：
        <el-select v-model="groupId" placeholder="请选择">
          <el-option
            :label="item.title"
            :value="item.id"
            v-for="item in option"
            :key="item.id"
          ></el-option>
        </el-select>
        </el-col>
        <el-col :span="12" class="tar">
          日期选择：
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
        </el-col>
    </el-row>
    <div
        id="myPieChart"
        class="mt20"
        :style="{ width: '400px', height: '400px' }"
      ></div>
  </div>
</template>
<script>
import { getInvi,getGroupsGift } from "@/api/active.js";
import echarts from "echarts";
export default {
  data(){
    return{
      dataRang: [
        new Date(new Date()).getTime()-
        3600 * 1000 * 24 * 7,
        new Date(new Date()).getTime()
      ], //  时间选择
      tableData: [], //列表
      option:[],
      groupId:null,
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
    }
  },
  async created(){
    let { data } = await getInvi();
    this.option = data;
    this.groupId = this.option[0].id
    this.getIndex()
  },
  methods:{
    getIndex(){
      getGroupsGift(this.groupId,{start:this.start,end:this.end}).then(res => {
        let item = [];
        let list = res.data;
        res.data.map(e => {
          item.push(e.name)
        })
        console.log(list,item)
        this.drawPie(res.data,item)
      })
    },
    // 日期选择
    change(val) {
      this.start = val[0];
      this.end = val[1] + 3600 * 1000 * 24;
    },
    // 饼图
    drawPie(dataSinPie, singlePieLe) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myPieChart"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "兑换码使用占比",
          left: "left"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          // orient: "vertical",
          bottom: "bottom",
          data: singlePieLe
        },
        series: [
          {
            name: "使用比",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: dataSinPie,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
  },
  computed: {
    dataList(){
      return [this.groupId,this.start,this.end]
    }
  },
  watch:{
    dataList(newVal){
      this.getIndex()
    }
  }
}
</script>