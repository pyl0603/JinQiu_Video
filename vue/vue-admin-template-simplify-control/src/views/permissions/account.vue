<template>
  <div class="account">
    <el-table :data="tableData" border style="width: 100%;" class="mt20">
      <el-table-column prop="time" label="类型" class="el-col-4"  width="200"></el-table-column>
      <el-table-column prop="name" label="账号" class="el-col-4" width="300"></el-table-column>
      <el-table-column label="操作" class="tar">
        <template slot-scope="scope">
            <!-- 改密/忘密 -->
          <el-button @click="untying(scope.row)" type="text" size="small">解绑</el-button>
          <el-button @click="handleClick(scope.row)" type="text" size="small">换号</el-button>
        </template>
      </el-table-column>
    </el-table>
     <!-- 弹窗 -->
    <el-dialog title="解绑邮箱" :visible.sync="dialogVisible" width="30%" :show-close="false">
      <div class="dialog-cont">
        <div>
          <em>邮箱账号：</em>
          <el-input placeholder="请输入"></el-input>
          <el-button type="dqx-btn" class="ml20">解绑</el-button>
        </div>
      </div>
    </el-dialog>
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
        .map(item => JSON.parse(item)),
        dialogVisible:true
    };
  },
  methods: {
    // 操作
    handleClick(val) {},
    // 解绑
    untying(val){

    }
  },
  mounted() {
    this.$store.commit("setPaging", true);
  }
};
</script>
