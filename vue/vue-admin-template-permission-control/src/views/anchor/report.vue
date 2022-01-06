<template>
  <div class="player">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        height="calc(100vh - 240px)"
      >
      <el-table-column label="时间">
           <template slot-scope="scope">
            {{scope.row.createdAt | formatTime}}
          </template>
        </el-table-column>
        <el-table-column label="用户名">
           <template slot-scope="scope">
            {{scope.row.nickname}}
          </template>
        </el-table-column>
        <el-table-column label="理由">
          <template slot-scope="scope">
            {{scope.row.reason.display}}
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作">
           <template slot-scope="scope">
            {{scope.row.streamer.fansNumber}}
          </template>
        </el-table-column> -->
      </el-table>
      <paging ref="paging" @changePage="changePage" :total="total" style="margin-top:10px"></paging>
  </div>
</template>

<script>
import paging from '@/components/Paging/pop-index';
import { getReport } from '@/api/setting'
import { formatTime } from "@/utils/index.js";
export default {
  props:{
    target:{
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tableData: [],
      page: 1,
      total: 0
    };
  },
    filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  async mounted() {
    this.$store.commit("setPaging", false);
    this.getList()
  },
  methods: {
    // 获取列表
    getList() {
      getReport({type: 3,target:this.target,page:this.page,page_size:10}).then(res => {
        this.tableData = res.data;
        this.total = res.meta.pagination.total
      });
    },
    changePage(val){
      this.page = val
    }
  },
  components:{
    paging
  },
   watch:{
     target(){
       this.page = 1;
       this.getList();
     },
     page(){
       this.getList()
     },
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-input-group__prepend {
  position: absolute;
  margin-top: 0px;
  line-height: 40px;
  width: 120px;
  height: 40px;
  z-index: 9;
  border-radius: 0;
}
iframe{
  width: 45vw;
  height: 70vh;
  overflow-y: scroll;
}
.el-input {
  display: inline-block;
  width: calc(40% - 120px);
  margin-right: 120px;
}
/deep/.el-dialog{
  margin-top: 5vh!important;
  height: 90vh;
}
/deep/.el-input-group > .el-input__inner {
  margin-left: 120px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
