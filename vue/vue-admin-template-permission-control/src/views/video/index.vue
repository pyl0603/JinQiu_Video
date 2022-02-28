<template>
  <div>
        <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      style="marginLeft:1rem"
    >
      <el-menu-item index=0>等待审核</el-menu-item>
      <el-menu-item index=1>审核通过</el-menu-item>
      <el-menu-item index=2>审核失败</el-menu-item>
      <el-menu-item index=3>删除</el-menu-item>
    </el-menu>


    <el-table
      :data="
        tableData.filter(
          data =>
            !search || data.name.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%"
    >
      <el-table-column>
        <template slot="header" slot-scope="scope">
          <el-input v-model="getVideoOptions.searchText" size="mini" placeholder="输入关键字搜索" @keyup.enter.native="submitSearch" />
        </template>
        <template slot-scope="scope">
          <el-button
            style="marginLeft:1rem"
            size="mini"
            type="text"
            @click="handlePass(scope.$index, scope.row)"
             v-if="getVideoOptions.state==='1'?false:true"
            >通过</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleFail(scope.$index, scope.row)"
             v-if="getVideoOptions.state==='2'?false:true"
            >不通过</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.$index, scope.row)"
            v-if="getVideoOptions.state==='3'?false:true"
            >删除</el-button
          >
            <el-button
            size="mini"
            type="text"
            @click="handleStatistical(scope.$index, scope.row)"
            >时段统计</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="视频简介" prop="detail"> </el-table-column>
      <el-table-column label="视频作者" prop="userInfo.nickname">
      </el-table-column>
      <el-table-column label="发布时间" prop="createTime"> </el-table-column>
    </el-table>

    <div style="position: absolute; right: 2%; bottom: 2%">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
      >
      </el-pagination>
    </div>
    <el-dialog
  :visible.sync="dialogVisible"
  >
  <EchartsBox :timeStatisticals="timeStatisticals" :Totime="Totime">
     <template #content>
                	<div id="main" style="width: 100%;height: 500px;background:#fff"></div>
            </template>
  </EchartsBox>
  <div slot="title">
    时间：
<el-date-picker
          class="ml10 mr30"
          v-model="timing"
          type="datetimerange"
          range-separator="至"
          @change="handlechangeTiming"
          value-format="timestamp"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <el-button type="primary" @click="handleClickCheck">查询</el-button>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import EchartsBox from '@/views/video/EchartsBox'
import { getVideo, failVideo, passVideo, deleteVideo,getVideoStatistical } from "@/api/video";
export default {
  components:{
    EchartsBox
  },
  data() {
    return {
      Totime:[],
      timeStatisticals:[],
       timing:0,
      dialogVisible:false,
      tableData: [],
      search: "",
      total: 0,
      pageSize: 0,
      activeIndex:'0',
      getVideoOptions: {
        pageNum: 1,
        pageSize: 10,
        searchText: null,
        	state:0
      },
         parmas:{
        videoId:0,
        startDate:null,
        endDate:null
      },
    };
  },
  methods: {
    async handlePass(index, row) {
        const res = await passVideo(row.id);
      if (res.code === 200) {
        this.$message({
          message: "视频审核通过",
          type: "success"
        });
        this.getVideoList();
      }
    },
    async handleFail(index, row) {
            const res = await failVideo(row.id);
      if (res.code === 200) {
        this.$message({
          message: "视频审核未通过",
          type: "success"
        });
        this.getVideoList();
      }
    },
    async handleDelete(index, row) {
      const res = await deleteVideo(row.id);
      if (res.code === 200) {
        this.$message({
          message: "视频已删除",
          type: "success"
        });
        this.getVideoList();
      }
    },
    handleCurrentChange(val) {
      this.getVideoOptions.pageNum = val
      this.getVideoList();
    },
      handleSelect(key,keypath){
      this.getVideoOptions.state = key
      console.log(this.getVideoOptions.state);
        this.getVideoList();
    },
    submitSearch(){
      console.log(this.getVideoOptions.searchText);
      this.getVideoList();
    },
     async handleStatistical(index, row) {
      this.dialogVisible = true
      this.parmas.videoId = row.id
    },
       handlechangeTiming(timing) {
         let time = []
         this.timing.map(item=>{
           time.push(
             moment(item).format(
            "YYYY-MM-DD HH:mm:ss"
          )
           )
         })
          this.Totime = time
      //获得时间戳
      this.parmas.endDate = timing[1]
      this.parmas.startDate = timing[0]
    },
       async handleClickCheck(){
      const res = await getVideoStatistical(this.parmas)
      
      const {} = res.data.videoInfo
      const { timeStatisticals } = res.data
      console.log(res.data);
      this.timeStatisticals = timeStatisticals
    },
    async getVideoList() {
      const res = await getVideo(this.getVideoOptions)
      if (res.code === 200) {
        const { list, total, pageNum, pageSize } = res.data;
        this.total = total;
        this.pageSize = pageSize;
        this.getVideoOptions.pageNum = pageNum;
        this.tableData = list;
        this.tableData.map(item => {
          item.createTime = moment(item.createTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
      }
    }
  },
  created() {
    this.getVideoList();
  }
};
</script>
