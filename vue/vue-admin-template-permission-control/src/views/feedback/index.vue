<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" >
  <el-menu-item index=0>未处理</el-menu-item>
  <el-menu-item index=1>处理成功</el-menu-item>
  <el-menu-item index=2>处理失败</el-menu-item>

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
    <el-table-column width="200" label="操作" >
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
          >处理成功</el-button
        >
      </template>
    </el-table-column>
    <el-table-column label="用户ID" prop="userId" width="280"> </el-table-column>
    <el-table-column label="视频ID" prop="videoId" width="280"> </el-table-column>
    <el-table-column label="反馈类型" prop="feedbackType" width="400"> </el-table-column>
    <el-table-column label="反馈内容" prop="feedbackNote" width="400"> </el-table-column>
    <el-table-column label="反馈时间" prop="createTime"></el-table-column>
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
  getplayList,
playFail,
playPass,
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
      const res = await playFail(row.id);
      if (res.code === 200) {
        this.$message({
          message: "封禁用户成功",
          type: "success"
        });
        this.userList();
      }
    },
    async handlePass(index, row) {
      const res = await playPass(row.id);
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
      const res = await getplayList(this.options);
      if (res.code === 200) {
        const { list, pageSize, total, pageNum } = res.data;
        this.tableData = list;
        this.options.pageSize = pageSize;
        this.total = total;
        this.options.pageNum = pageNum;
           this.tableData.map((item) => {
             item.feedbackType===0?item.feedbackType= '网络正常无法播放视频':(item.feedbackType===1?item.feedbackType= '视频画面正常没声音':(item.feedbackType===2?item.feedbackType= '播放几秒/中途卡住':(item.feedbackType===3?item.feedbackType= '播放过程中闪退回桌面':(item.feedbackType===4?item.feedbackType= '画面模糊不清晰':(item.feedbackType===5?item.feedbackType= '视频播放其他问题或建议':'')))))


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
