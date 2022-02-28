<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index=0>未审核</el-menu-item>
      <el-menu-item index=1>审核未通过</el-menu-item>
      <el-menu-item index=2>审核通过</el-menu-item>
      <el-menu-item index=3>已删除</el-menu-item>
    </el-menu>

    <el-table
      :data="
        tableData.filter(
          data =>
            !search || data.name.toLowerCase().includes(search.toLowerCase())
        )
      "
      style=""
    >
      <el-table-column width="400">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="dto.dto.searchText"
            @keyup.enter.native="submitSearch"
            size="mini"
            placeholder="输入关键字搜索"
          />
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            style="marginLeft:1rem"
            v-if="dto.status==='2'?false:true"
            @click="handlePassThrough(scope.$index, scope.row)"
            >通过</el-button
          >
          <el-button
            size="mini"
            type="text"
            v-if="dto.status==='1'?false:true"
            @click="handleFail(scope.$index, scope.row)"
            >不通过</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.$index, scope.row)"
            v-if="dto.status==='3'?false:true"
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

      <el-table-column label="文章标题" prop="title"> </el-table-column>
      <el-table-column
        label="文章作者"
        width="400"
        prop="authorUserInfo.nickname"
      >
      </el-table-column>
      <el-table-column label="文章类型" width="400" prop="type">
      </el-table-column>
      <el-table-column width="300" label="发布时间" prop="createTime">
      </el-table-column>
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
import EchartsBox from '@/views/video/EchartsBox'
import {
  getInformation,
  failInformation,
  passInformation,
  deleteInformation,
  getStatistical
} from "@/api/Information";
import moment from "moment";
export default {
  components:{EchartsBox},
  data() {
    return {
      Totime:[],
      timeStatisticals:[],
      timing:0,
      dialogVisible:false,
      tableData: [],
      total:0,
      pageSize:0,
      activeIndex:'0',
      search: "",
      parmas:{
        newsId:0,
        startDate:null,
        endDate:null
      },
      dto: {
        dto: {
          matchId: null,
          searchText: "",
          tagId: null,
          tagIsTeam: null,
          tagTeamType: null
        },
        status: 0,
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    async handlePassThrough(index, row) {
      const res = await passInformation(row.id);
      if (res.code === 200) {
        this.$message({
          message: "资讯审核通过",
          type: "success"
        });
        this.getNews();
      }
    },
    async handleFail(index, row) {
      const res = await failInformation(row.id);
      if (res.code === 200) {
        this.$message({
          message: "资讯审核不通过",
          type: "success"
        });
        this.getNews();
      }
    },
    async handleDelete(index, row) {
      const res = await deleteInformation(row.id);
      if (res.code === 200) {
        this.$message({
          message: "已删除资讯",
          type: "success"
        });
        this.getNews();
      }
    },
    async handleStatistical(index, row) {
      this.dialogVisible = true
      console.log(row);
      this.parmas.newsId = row.id
    },
    async handleClickCheck(){
      const res = await getStatistical(this.parmas)
      console.log(res);
      const {} = res.data.newsInfo
      const { timeStatisticals } = res.data
      console.log(res.data);
      this.timeStatisticals = timeStatisticals
    },
    handleSelect(key,keypath){
      this.dto.status = key
        this.getNews();
    },
     handleCurrentChange(val) {
      this.dto.pageNum = val;
      this.getNews();
    },
    submitSearch() {
      this.getNews();
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
    async getNews() {
      const res = await getInformation(this.dto);
      if (res.code === 200) {
      
        const { list, pageSize, pageNum, total } = res.data;
        this.pageSize = pageSize
        this.total = total
        this.tableData = list;
        this.tableData.map(item => {
          item.type === 0
            ? (item.type = "赛前分析")
            : item.type === 1
            ? (item.type = "快讯")
            : item.type === 2
            ? (item.type = "战报")
            : "无类型";
          item.createTime = moment(item.createTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
      }
    }
  },
  created() {
    this.getNews();
  }
};
</script>
