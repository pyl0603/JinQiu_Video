<template>
  <div class="protocol">
      <!-- <el-row class="search-bar mb20">
      <el-col :span="12">
        <em class="mr10 c171">文档名称:</em>
        <el-input class="mr10">1212</el-input>
        <el-button type="dqx-btn">查询</el-button>
      </el-col>
      <el-col :span="12" style="text-align:right;">
        <el-button type="dqx-btn">新增</el-button>
      </el-col>
    </el-row> -->
    <div>
      <el-table :data="tableData" border style="width: 100%;">
        <el-table-column prop="name" label="文档名称" class="el-col-4"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small">修改</el-button>
            <upload ref="upload" @upFile="upFile($event,scope.row.sign)"></upload>
            <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button> -->
          </template>
        </el-table-column>
         <!-- <el-table-column label="是否展示" width="100">
          <template slot-scope="scope">
            <el-switch :key="scope.$index" :value="scope.row.isOpen" @change="changeSwitch($event, scope.row)"/>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
  </div>
</template>
<script>
import {getLicences,changeLis} from '@/api/setting'
import upload from "@/components/UploadFile/uploadPdf";
export default {
  data() {
    return {
      tableData: []
    };
  },
  components:{
    upload
  },
  methods: {
    // 是否展示
    changeSwitch(val, row){
        row.isOpen = val;
    },
    async upFile(val,e){
      let msg = await this.setLicences(val,e)
    },
    //修改事件
    async setLicences(val,e){
      changeLis({sign:e,url:val}).then(_ => {
          return this.$message('修改成功')
      })
    },
  },
  mounted() {
    this.$store.commit("setPaging", false);
    getLicences().then(res => {
      this.tableData = res.data;
    })
  },
  computed: {}
};
</script>
<style lang="scss" scoped>
.protocol {
  .search-bar {
    .el-input {
      display: inline-block;
      width: 300px;
    }
  }
  /deep/.inputFlie{
    position: absolute;
    margin-top: -22px;
    width: 50px;
    opacity: 0;
  }
}
</style>

