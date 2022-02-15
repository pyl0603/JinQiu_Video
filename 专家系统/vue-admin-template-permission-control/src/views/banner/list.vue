<template>
  <div class="banner-his">
    <el-row class="search-bar">
      <el-col :span="12">
        <em class="mr10 c171">搜索记录:</em>
        <el-input class="mr10">1212</el-input>
        <el-button type="dqx-btn">查询</el-button>
      </el-col>
      <el-col :span="12" style="text-align:right;">
        <em class="mr10">选择日期：</em>
        <el-date-picker
          v-model="dataRang"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          @change="change"
        ></el-date-picker>
      </el-col>
    </el-row>
    <div class="history mt20">
      <el-table :data="tableData" border style="width: 100%;">
        <el-table-column prop="time" label="发布时间" class="el-col-6"></el-table-column>
        <el-table-column prop="name" label="预览图" class="el-col-6"></el-table-column>
        <el-table-column prop="province" label="文章列表" style="width:10%;"></el-table-column>
        <el-table-column prop="ads" label="关键词" style="width:20%;"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
const items = {
  time: "2016-05-02",
  name: "王小虎",
  province: "上海",
  city: "普陀区",
  ads: "上海市普陀区金沙江路 1518 弄",
  zip: 200333
};
export default {
  data() {
    return {
      dataRang: "",
      tableData: Array(10).fill(items)
    };
  },
  methods: {
    change(val) {
      console.log(val[0], val[1]);
    },
    handleClick(val) {
      this.$emit("chooseItem", val);
    }
  },
  mounted() {
    this.$store.commit("setPaging", true);
  }
};
</script>
<style lang="scss" scoped>
.banner-his {
  .el-table{
    max-height: calc(100vh - 290px);
    td{
        padding: 2px 0;
        height: 6vh;
    }
  }
  .search-bar {
    .el-input {
      display: inline-block;
      width: 300px;
    }
  }
}
</style>
