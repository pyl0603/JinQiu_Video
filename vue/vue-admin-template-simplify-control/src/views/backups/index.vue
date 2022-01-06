<template>
  <div class="backups">
    <el-row>
      <em>选择日期：</em>
      <el-date-picker
        v-model="dataRang"
        type="daterange"
        value-format="timestamp"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-button type="dqx-btn" class="ml20">查询</el-button>
      <el-button>重置</el-button>
    </el-row>
     <!-- 表格 -->
      <el-table :data="tableData" border style="width: 100%;" class="mt20">
        <el-table-column prop="time" label="操作人" class="el-col-4"></el-table-column>
        <el-table-column prop="name" label="备份日期" class="el-col-4"></el-table-column>
        <el-table-column prop="province" label="备份大小" ></el-table-column>
        <el-table-column prop="province" label="日志查看"></el-table-column>
        <el-table-column label="还原" width="200">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">还原</el-button>
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
  isOpen:true
};
export default {
  data() {
    return {
      dataRang: "",
      tableData: Array(10).fill(JSON.stringify(item)).map(item => JSON.parse(item)),
    };
  },
  methods:{
      handleClick(val){},
      
  },
  mounted(){
      this.$store.commit('setPaging',true);
  }
};
</script>
