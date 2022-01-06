<template>
  <div class="staff-man">
    <el-table :data="tableData" border style="width: 100%;" class="mt20">
      <el-table-column prop="time" label="账户" class="el-col-4"></el-table-column>
      <el-table-column prop="name" label="姓名" class="el-col-4"></el-table-column>
      <el-table-column prop="province" label="职务"></el-table-column>
      <el-table-column prop="province" label="手机"></el-table-column>
      <el-table-column prop="province" label="邮箱"></el-table-column>
      <el-table-column prop="province" label="超级管理员"></el-table-column>
      <el-table-column prop="province" label="允许登录"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
          <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
const item = {
  time: "2016-05-02",
  name: "王小虎",
  province: "上海",
  city: "普陀区",
  ads: "上海市普陀区金沙江路 1518 弄",
  zip: 200333,
  isOpen: true
};
export default {
  data() {
    return {
      tableData: Array(10)
        .fill(JSON.stringify(item))
        .map(item => JSON.parse(item))
    };
  },
  methods: {
    // 操作
    handleClick(val) {}
  },
  mounted() {
    this.$store.commit("setPaging", true);
  }
};
</script>
