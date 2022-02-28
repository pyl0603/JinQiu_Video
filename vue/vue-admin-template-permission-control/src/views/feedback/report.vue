<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" >
  <el-menu-item index=0>未处理</el-menu-item>
  <el-menu-item index=1>举报成功</el-menu-item>
  <el-menu-item index=2>举报失败</el-menu-item>

</el-menu>
    <el-table
    :data="
      tableData.filter(
        data =>
          !options.searchText ||
          data.name.toLowerCase().includes(options.searchText.toLowerCase())
      )
    "
    style="width: 100%"
  >
    <el-table-column label="操作" >
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="text"
         
          @click="handleFail(scope.$index, scope.row)"
          v-if="options.state==='2'?false:true"
          >忽略</el-button
        >
        <el-button
          size="mini"
          type="text"
          
          @click="handlePass(scope.$index, scope.row)"
           v-if="options.state==='1'?false:true"
          >举报成功</el-button
        >
      </template>
    </el-table-column>
    <el-table-column label="举报人" prop="reportUserInfo.nickname" > </el-table-column>
    <el-table-column label="手机" prop="reportUserInfo.mobile" > </el-table-column>
    <el-table-column label="举报类型" prop="reportType" > </el-table-column>
    <el-table-column label="举报内容" prop="reportNote" > </el-table-column>
    <el-table-column label="举报时间" prop="createTime"></el-table-column>
    <el-table-column label="被举报视频" prop="content.detail"></el-table-column>
    <el-table-column label="视频ID" prop="content.id"></el-table-column>
    <el-table-column label="视频发布者" prop="content.userInfo.nickname"></el-table-column>
    <el-table-column label="视频发布者手机" prop="content.userInfo.mobile"></el-table-column>
  </el-table>
   <div style="position: absolute; right: 2%; bottom: 2%">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="options.pageSize"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
 getReportList,
ReportFail,
ReportPass,
} from "@/api/feedback";
import moment from "moment";

export default {
  data() {
    return {
      activeIndex:'0',
      tableData: [],
      options: {
        pageNum: 1,
        pageSize: 10,
        searchText: "",
        state: 0
      },
      total: 0,
    };
  },
  methods: {
    async handleFail(index, row) {
      const res = await ReportFail(row.id);
      if (res.code === 200) {
        this.$message({
          message: "封禁用户成功",
          type: "success"
        });
        this.userList();
      }
    },
    async handlePass(index, row) {
      const res = await ReportPass(row.id);
      if (res.code === 200) {
        this.$message({
          message: "解禁用户成功",
          type: "success"
        });
        this.userList();
      }
    },
      handleSelect(key, keyPath) {
        this.options.state = key
        this.userList();
      },
      handleCurrentChange(val) {
        this.options.pageNum = val
      this.userList()
    },
    searchUser(){
        this.userList();
    },
    async handleDetail(index,row){
      const res = await getUserDetail(row.id);
      console.log(res);
    },
    async userList() {
      const res = await getReportList(this.options);
      if (res.code === 200) {
        const { list, pageSize, total, pageNum } = res.data;
        this.tableData = list;
        this.options.pageSize = pageSize;
        this.total = total;
        this.options.pageNum = pageNum;
           this.tableData.map((item) => {
             item.reportType===0?item.reportType= '内容违规':(item.reportType===1?item.reportType= '侵犯权益':(item.reportType===2?item.reportType= '未成年':(item.reportType===3?item.reportType= '其他':(item.reportType===4?item.reportType= '时政不实信息':(item.reportType===5?item.reportType= '未成年相关': item.reportType===6?item.reportType= '涉嫌诈骗':( item.reportType===7?item.reportType= '此账号可能背盗用了': item.reportType===8?item.reportType= '引导私下交易':''))))))


          item.createTime = moment(item.createTime).format(
            "YYYY-MM-DD HH:mm"
          );
        });
      }
    }
  },

  created() {
    this.userList();
  }
};
</script>
<style lang=""></style>
