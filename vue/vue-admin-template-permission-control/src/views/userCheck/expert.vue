<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" style="marginLeft:1rem">
  <el-menu-item index=-1>所有</el-menu-item>
  <el-menu-item index=0>通过</el-menu-item>
  <el-menu-item index=1>未通过</el-menu-item>

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
    <el-table-column width="200">
      <template slot="header" slot-scope="scope">
        <el-input
          v-model="options.searchText"
          size="mini"
          placeholder="输入关键字搜索"
          @keyup.enter.native="searchUser"
        />
      </template>
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="text"
          style="marginLeft:1rem"
          @click="handleFail(scope.$index, scope.row)"
          v-if="options.checkState==='0'?false:true"
          >不通过</el-button
        >
        <el-button
          size="mini"
          type="text"
          
          @click="handlePass(scope.$index, scope.row)"
           v-if="options.checkState==='1'?false:true"
          >通过</el-button
        >
           <el-button
          size="mini"
          type="text"
          
          @click="handleDetail(scope.$index, scope.row)"
          >详情</el-button
        >
      </template>
    </el-table-column>
    <el-table-column label="ID" prop="id" width="280"> </el-table-column>

    <el-table-column align="center" width="400" label="头像">
      <template slot-scope="scope">
        <img
          :src="scope.row.avatar"
          width="40"
          height="40"
          style="borderRadius:50%;"
        />
      </template>
    </el-table-column>
    <el-table-column label="用户昵称" width="400" prop="nickname"> </el-table-column>
    <el-table-column label="手机" prop="mobile" width="400"> </el-table-column>
    <el-table-column label="创建时间" prop="createdAt"></el-table-column>
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
  getUserList,
  lockUser,
  unlockUser,
  checkUserInfo,
  getUserDetail,
  passCheckUser,
failCheckUser,
} from "@/api/staff";
import moment from "moment";

export default {
  data() {
    return {
      activeIndex:'-1',
      tableData: [],
      options: {
        pageNum: 1,
        pageSize: 10,
        searchText: "",
        checkState: -1
      },
      total: 0,
    };
  },
  methods: {
    async handleFail(index, row) {
      const res = await failCheckUser(row.id);
      if (res.code === 200) {
        this.$message({
          message: "封禁用户成功",
          type: "success"
        });
        this.userList();
      }
    },
    async handlePass(index, row) {
      const res = await passCheckUser(row.id);
      if (res.code === 200) {
        this.$message({
          message: "解禁用户成功",
          type: "success"
        });
        this.userList();
      }
    },
      handleSelect(key, keyPath) {
        this.options.checkState = key
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
      const res = await checkUserInfo(this.options);
      if (res.code === 200) {
        const { list, pageSize, total, pageNum } = res.data;
        this.tableData = list;
        this.options.pageSize = pageSize;
        this.total = total;
        this.options.pageNum = pageNum;
           this.tableData.map((item) => {
          item.createdAt = moment(item.createdAt).format(
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
