<template>
  <div class="channel">
    <top-tab ref="topTab" @chooseTab="chooseTab" :tabList="tabList"></top-tab>
    <!-- <div class="el-col-24 mb20 cada f14 tar">
      <el-input placeholder="请输入"></el-input>
      <el-button type="dqx-btn" @click="search" class="ml10">查询</el-button>
    </div> -->
    <el-table :data="tableData" border style="width: 100%;">
      <el-table-column label="时间" class="el-col-4">
        <template slot-scope="scope">{{scope.row.createdAt | formatTime}}</template>
      </el-table-column>
      <el-table-column prop="referName" label="被举报者" class="el-col-4"></el-table-column>
      <el-table-column prop="reason.display" label="违规列别" style="width:10%;"></el-table-column>
      <el-table-column prop="content" label="违规内容" style="width:10%;"></el-table-column>
      <el-table-column prop="beReportCount" label="累计次数" style="width:10%;"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="updata(scope.row.id)" type="text" size="small">详情</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="是否屏蔽" width="100">
        <template slot-scope="scope">
          <el-switch
            :key="scope.$index"
            :value="scope.row.isShow"
            @change="changeSwitch($event, scope.row)"
          />
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 弹窗 -->
    <el-dialog title="举报详情" :visible.sync="dialogVisible" width="50%" :show-close="false">
      <div class="dialog-cont el-col-24">
        <div class="el-col-8 mt20">
          <em>举报时间：</em>
          <el-input placeholder="请输入举报时间" v-model="report.createdAt" readonly="readonly"></el-input>
        </div>
        <div class="el-col-8 mt20">
          <em>举报人：</em>
          <el-input placeholder="请输入举报人" v-model="report.nickname" readonly="readonly"></el-input>
        </div>
        <div class="el-col-8 mt20">
          <em>违规类别：</em>
          <el-input placeholder="请输入违规类别" v-model="report.reason.display" readonly="readonly"></el-input>
        </div>
        <div class="el-col-8 mt20">
          <em>被举报人：</em>
          <el-input placeholder="请输入被举报人" v-model="report.referName" readonly="readonly"></el-input>
        </div>
        <div class="el-col-8 mt20">
          <em>累计次数：</em>
          <el-input placeholder="请输入累计次数" v-model="report.beReportCount" readonly="readonly"></el-input>
        </div>
        <div class="el-col-24 mt20">
          <em>违规内容：</em>
          <el-input placeholder="请输入违规内容" v-model="report.summary" type="textarea" readonly="readonly"></el-input>
        </div>
      </div>
      <div class="cont-two el-col-24">
        <div class="el-col-24 mt20">
          <em>违规判定：</em>
          <el-select v-model="value" placeholder="请选择" @change="change">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="el-col-24 mt20">
          <em>判定时间：</em>
          <el-select v-model="valueTime" placeholder="请选择" @change="changeTime">
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div slot="footer" class="dialog-footer mt20 tac el-col-24 mb10">
          <el-button type="dqx-btn" @click="doReports">保存</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import TopTab from "@/views/common/top-tab";
import { mapGetters } from "vuex";
import { formatTime } from "@/utils/index.js";
import {
  getReport,
  getReportDet,
  doReport
} from "@/api/setting";
export default {
  data() {
    return {
      tabList: [
        { name: "未处理违规", value: 0},
        { name: "已处理违规", value: 1}
      ],
      isDone:0,
      dialogVisible: false,
      id:'',
      report:{
        createdAt:'',
        nickname:'',
        reason:{
          display:''
        },
        referName:'',
        id:'',
        summary:'',
        beReportCount:''
      },  
      tableData:[],
      options: [
        {
          value: 999,
          label: "未违规"
        },
        {
          value: 0,
          label: "仅删除"
        },
        {
          value: 1,
          label: "禁言"
        }
      ],
      option: [
        {
          value: 2,
          label: "2小时"
        },
        {
          value: 6,
          label: "6小时"
        },
        {
          value: 12,
          label: "12小时"
        },
        {
          value: 24,
          label: "一天"
        },
        {
          value: 168,
          label: "一周"
        },
        {
          value: 5040,
          label: "一个月"
        },
        {
          value: 9999999,
          label: "永久"
        }
      ],
      value: 999,
      valueTime:2
    };
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  components:{
    TopTab
  },
  methods: {
    //   下拉选择
    change(val){
      if(val === 0){
        this.valueTime = 9999999
      }
    },
    // 下拉时间选择
    changeTime(val){
    },
    // 筛选
    chooseTab(val){
      
      this.isDone = val;
    },
    //   查询
    search() {},
    //   是否屏蔽
    changeSwitch() {},
    //   发送确认事件
    confirm() {},
    // 获取列表
    getList(){
      getReport({'done':this.isDone,page:this.page}).then(res => {
        this.tableData = res.data
        this.$store.commit("setTotal", res.meta.pagination.total);
      })
    },
    // 获取详情
    updata(val){
      this.id = val
      getReportDet(val).then(res => {
        this.report = res.data
        this.dialogVisible = true
      })
    },
    // 处理举报
    doReports(){
      doReport(this.id,{action:this.value,hours:this.valueTime}).then(_ => {
        this.$message('处理成功')
        this.getList()
        this.dialogVisible = false;
      })
    }
  },
  mounted() {
    this.$store.commit("setPaging", true);
    this.getList()
  },
  computed: {
    dataList() {
      let val = [this.def, this.page];
      return val;
    },
    ...mapGetters(["page"])
  },
  watch: {
    dataList(newVal) {
      this.getList();
    },
    page(newVal) {
      console.log(newVal);
    },
    isDone(newVal){
      this.getList()
    }
  }
};
</script>
<style lang="scss" scoped>
.show-tab {
  display: inline-block;
  width: 120px;
  text-align: center;
}
.show-tab + .show-tab {
  border-left: 1px solid #f5f5f5;
}
/deep/.el-dialog__body {
  padding: 0;
}
.el-input {
  width: 200px;
}
.el-textarea {
  display: inline-block;
  width: calc(100% - 120px);
}
.dialog-cont,.cont-two {
  background: #fff;
  padding: 0 10px;
}
</style>


